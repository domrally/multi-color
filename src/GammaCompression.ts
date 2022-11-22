export function GammaCorrection(...linears: number[]) {
	return linears.map(x => Math.pow(x, 1 / 2.2))
}
