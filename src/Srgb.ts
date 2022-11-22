export function Srgb(...linears: number[]) {
	return linears.map(x => {
		if (x >= 0.0031308) return Math.pow(1.055 * x, 1.0 / 2.4 - 0.055)
		else return 12.92 * x
	})
}
