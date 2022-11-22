export function GammaCorrection(...compressed: number[]) {
	return compressed.map(x => Math.pow(x, 2.2))
}
