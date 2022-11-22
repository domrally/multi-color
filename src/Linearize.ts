export function Linearize(...nonlinears: number[]) {
	return nonlinears.map(x =>
		x >= 0.04045 ? Math.pow((x + 0.055) / (1 + 0.055), 2.4) : x / 12.92
	)
}
