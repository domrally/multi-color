import { GammaCorrection } from './GammaCorrection'
import { Linearize } from './Linearize'
import { Oklab } from './Oklab'
import { Polar } from './Polar'
import { Rgb } from './Rgb'
import { Srgb } from './Srgb'

/**
 *
 */
export class MultiColor extends HTMLElement {
	constructor() {
		super()

		const shadowRoot = this.attachShadow({ mode: 'open' })
		shadowRoot.innerHTML =
			'<style>canvas{position:absolute;inset:0;width:100%;height:100%;}</style><canvas></canvas><slot></slot>'
		const canvas = shadowRoot.querySelector('canvas') as HTMLCanvasElement,
			context = canvas.getContext('2d')!,
			redraw = () =>
				draw(context, [
					{ r: 0, g: 1, b: 1, a: 1 },
					{ r: 1, g: 0, b: 1, a: 1 },
					{ r: 1, g: 0, b: 1, a: 1 },
					{ r: 0, g: 0, b: 1, a: 1 },
					// this.getAttribute('nw')!,
					// this.getAttribute('ne')!,
					// this.getAttribute('sw')!,
					// this.getAttribute('se')!,
				])

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
function draw(
	context: CanvasRenderingContext2D,
	corners: { r: number; g: number; b: number; a: number }[]
) {
	context.canvas.width = context.canvas.clientWidth
	context.canvas.height = context.canvas.clientHeight

	const { width, height } = context.canvas,
		imageData = context.getImageData(0, 0, width, height),
		{ data } = imageData,
		[nw, ne, sw, se] = corners.map(srgba => {
			const [r, g, b, a] = Linearize(srgba.r, srgba.g, srgba.b, srgba.a),
				lab = Oklab({ r: r!, g: g!, b: b! })

			return [lab.L, lab.a, lab.b, a]
		}),
		nW = Polar({ a: nw![1]!, b: nw![2]! }).C,
		nE = Polar({ a: ne![1]!, b: ne![2]! }).C,
		sW = Polar({ a: sw![1]!, b: sw![2]! }).C,
		sE = Polar({ a: se![1]!, b: se![2]! }).C

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			const p = i / width,
				q = j / height,
				lcha = new Array<number>(4)

			for (let k = 0; k < 4; k++) {
				lcha[k] =
					nw![k]! * (1 - p) * (1 - q) +
					ne![k]! * p * (1 - q) +
					sw![k]! * q * (1 - p) +
					se![k]! * p * q
			}

			const { C } = Polar({ a: lcha[1]!, b: lcha[2]! }),
				thing =
					nW * (1 - p) * (1 - q) +
					nE * p * (1 - q) +
					sW * q * (1 - p) +
					sE * p * q

			lcha[1] *= thing / C
			lcha[2] *= thing / C

			const //
				rgba = Rgb({ L: lcha[0]!, a: lcha[1]!, b: lcha[2]! }),
				srgba = Srgb(rgba.r, rgba.g, rgba.b, lcha[3]!),
				display = GammaCorrection(...srgba),
				[r, g, b, t] = display,
				[x, y, z, w] = getColorIndicesForCoord(i, j, width)

			data[x!] = r! * 255
			data[y!] = g! * 255
			data[z!] = b! * 255
			data[w!] = t! * 255
		}
	}

	imageData.data.set(data)
	context.putImageData(imageData, 0, 0)
}

function getColorIndicesForCoord(x: number, y: number, width: number) {
	const red = y * (width * 4) + x * 4
	return [red, red + 1, red + 2, red + 3]
}
