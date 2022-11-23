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
		shadowRoot.innerHTML =
			'<style>canvas{position:absolute;inset:0;width:100%;height:100%;}</style><canvas></canvas><slot></slot>'
		const canvas = shadowRoot.querySelector('canvas') as HTMLCanvasElement,
			context = canvas.getContext('2d')!,
			redraw = () => {
				const style = getComputedStyle(this),
					nw = new Color(style.getPropertyValue('--nw') || '#0000'),
					ne = new Color(style.getPropertyValue('--ne') || '#0000'),
					sw = new Color(style.getPropertyValue('--sw') || '#0000'),
					se = new Color(style.getPropertyValue('--se') || '#0000')

				draw(context, [nw, ne, sw, se])
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
 *
 * @param element -
 * @returns
 */
function draw(context: CanvasRenderingContext2D, corners: Color[]) {
	context.canvas.width = context.canvas.clientWidth
	context.canvas.height = context.canvas.clientHeight

	const { width, height } = context.canvas,
		imageData = context.getImageData(0, 0, width, height),
		{ data } = imageData,
		[nw, ne, sw, se] = corners.map(color => {
			const [L, a, b] = color.to('oklab', { inGamut: true }).coords
			return [L, a, b, color.alpha]
		}),
		nW = Polar({ a: nw![1]!, b: nw![2]! }).C,
		nE = Polar({ a: ne![1]!, b: ne![2]! }).C,
		sW = Polar({ a: sw![1]!, b: sw![2]! }).C,
		sE = Polar({ a: se![1]!, b: se![2]! }).C

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			// parameterize the rectangle
			const p = i / width,
				q = j / height,
				lcha = new Array<number>(4)

			// linear interpolation
			for (let k = 0; k < 4; k++) {
				lcha[k] =
					nw![k]! * (1 - p) * (1 - q) +
					ne![k]! * p * (1 - q) +
					sw![k]! * q * (1 - p) +
					se![k]! * p * q
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
				[red, green, blue] = sRGB.map(x => Math.pow(x, 2.2)),
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
}
