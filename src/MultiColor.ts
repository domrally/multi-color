import Color from 'colorjs.io'
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

				img {
					position: absolute;
					inset: 0;
					width: 100%;
					height: 100%;
					visibility: hidden;
				}
			</style>
			<img />
			<canvas></canvas>
			<slot></slot>
		`
		let oldUrl = ''
		const canvas = shadowRoot.querySelector('canvas') as HTMLCanvasElement,
			context = canvas.getContext('2d')!,
			image = shadowRoot.querySelector('img') as HTMLImageElement,
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
					),
					dataUrl = draw(canvas, context, [
						topLeft,
						topRight,
						bottomLeft,
						bottomRight,
					])

				// when preload is complete, apply the image to the div
				image.onload = () => {
					this.style.backgroundImage = `${oldUrl} url(${dataUrl})`
					oldUrl = `url(${dataUrl})`
				}

				// setting 'src' actually starts the preload
				image.src = dataUrl
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
function draw(
	canvas: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
	corners: Color[]
) {
	const { clientWidth, clientHeight } = canvas
	canvas.width = clientWidth
	canvas.height = clientHeight

	const imageData = context.createImageData(clientWidth, clientHeight),
		{ data } = imageData,
		dataCopy = new Uint8ClampedArray(data),
		[topLeft, topRight, bottomLeft, bottomRight] = corners.map(color => {
			const [L, a, b] = color.to('oklab', { inGamut: true }).coords
			return [L, a, b, color.alpha]
		})

	for (let i = 0; i < clientWidth; i++) {
		for (let j = 0; j < clientHeight; j++) {
			// parameterize the rectangle
			const p = i / (clientWidth - 1),
				q = j / (clientHeight - 1),
				lcha = new Array<number>(4)

			// linear interpolation
			for (let k = 0; k < 4; k++) {
				lcha[k] =
					topLeft![k]! * (1 - p) * (1 - q) +
					topRight![k]! * p * (1 - q) +
					bottomLeft![k]! * q * (1 - p) +
					bottomRight![k]! * p * q
			}

			// TODO: fix this to actually be correct
			const [L, a, b, alpha] = lcha,
				// transform from OkLab to sRGB space
				sRGB = Srgb({ L: L!, a: a!, b: b! }),
				// gamma correction for display
				[red, green, blue] = sRGB.map(x => Math.pow(x, 2.2)),
				// coordinate pixel indices
				x = j * (clientWidth * 4) + i * 4,
				[y, z, w] = [x + 1, x + 2, x + 3]

			// set pixel values
			dataCopy[x!] = Math.floor(red! * 255)
			dataCopy[y!] = Math.floor(green! * 255)
			dataCopy[z!] = Math.floor(blue! * 255)
			dataCopy[w!] = Math.floor(alpha! * 255)
		}
	}

	// draw image
	imageData.data.set(dataCopy)
	context.putImageData(imageData, 0, 0)

	// export image to data url
	const dataUrl = context.canvas.toDataURL()

	// set background image
	return dataUrl
}
