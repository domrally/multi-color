import Color from 'colorjs.io'
import { Polar } from './Polar'
import { Srgb } from './Srgb'

/**
 * A four corner gradient in cylindrical OkLab color space
 */
export class MultiColor extends HTMLElement {
	constructor() {
		super()

		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.innerHTML = `
			<style>
				:host {
					position: relative;
				}

				canvas { 
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
					visibility: hidden;
				}
			</style>
			<canvas></canvas>
			<slot></slot>
		`
		const canvas = shadowRoot.querySelector('canvas') as HTMLCanvasElement,
			context = canvas.getContext('2d')!,
			redraw = () => {
				const style = getComputedStyle(this),
					topLeft = new Color(
						style.getPropertyValue('--background-top-left-color') || '#0000'
					),
					topRight = new Color(
						style.getPropertyValue('--background-top-right-color') || '#0000'
					),
					bottomLeft = new Color(
						style.getPropertyValue('--background-bottom-left-color') || '#0000'
					),
					bottomRight = new Color(
						style.getPropertyValue('--background-bottom-right-color') || '#0000'
					)

				this.style.backgroundImage = draw(context, [
					topLeft,
					topRight,
					bottomLeft,
					bottomRight,
				])
			}

		new ResizeObserver(redraw).observe(this)
		new MutationObserver(redraw).observe(this, {
			attributes: true,
			childList: true,
			subtree: true,
		})
	}
}
customElements.define('multi-color', MultiColor)

/**
 * draws the gradient to a css image url
 * @param context
 * @param corners
 * @returns png data url
 */
function draw(context: CanvasRenderingContext2D, corners: Color[]) {
	context.canvas.width = context.canvas.clientWidth
	context.canvas.height = context.canvas.clientHeight

	const { width, height } = context.canvas,
		imageData = context.getImageData(0, 0, width, height),
		{ data } = imageData,
		[topLeft, topRight, bottomLeft, bottomRight] = corners.map(color => {
			const [L, a, b] = color.to('oklab', { inGamut: true }).coords
			return [L, a, b, color.alpha]
		}),
		nW = Polar({ a: topLeft![1]!, b: topLeft![2]! }).C,
		nE = Polar({ a: topRight![1]!, b: topRight![2]! }).C,
		sW = Polar({ a: bottomLeft![1]!, b: bottomLeft![2]! }).C,
		sE = Polar({ a: bottomRight![1]!, b: bottomRight![2]! }).C

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			// parameterize the rectangle
			const p = i / width,
				q = j / height,
				lcha = new Array<number>(4)

			// linear interpolation
			for (let k = 0; k < 4; k++) {
				lcha[k] =
					topLeft![k]! * (1 - p) * (1 - q) +
					topRight![k]! * p * (1 - q) +
					bottomLeft![k]! * q * (1 - p) +
					bottomRight![k]! * p * q
			}

			// transform to polar interpolation
			let [L, a, b, alpha] = lcha,
				{ C } = Polar({ a: a!, b: b! }),
				thing =
					nW * (1 - p) * (1 - q) +
					nE * p * (1 - q) +
					sW * q * (1 - p) +
					sE * p * q
			a! *= thing / C
			b! *= thing / C

			const // transform from OkLab to sRGB space
				sRGB = Srgb({ L: L!, a: a!, b: b! }),
				// gamma correction for display
				[red, green, blue] = sRGB.map(x => Math.pow(x, 1.0)),
				// coordinate pixel indices
				x = j * (width * 4) + i * 4,
				[y, z, w] = [x + 1, x + 2, x + 3]

			// set pixel values
			data[x!] = red! * 255
			data[y!] = green! * 255
			data[z!] = blue! * 255
			data[w!] = alpha! * 255
		}
	}

	// draw image
	imageData.data.set(data)
	context.putImageData(imageData, 0, 0)

	// export image to data url
	const dataUrl = context.canvas.toDataURL()

	// set background image
	return `url(${dataUrl})`
}
