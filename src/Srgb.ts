export function Srgb(lab: { L: number; a: number; b: number }) {
	const { L, a, b } = lab,
		l_ = L + 0.3963377774 * a + 0.2158037573 * b,
		m_ = L - 0.1055613458 * a - 0.0638541728 * b,
		s_ = L - 0.0894841775 * a - 1.291485548 * b,
		l = l_ * l_ * l_,
		m = m_ * m_ * m_,
		s = s_ * s_ * s_,
		linears = [
			+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
			-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
			-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
		]

	return linears.map(x => {
		if (x >= 0.0031308) return Math.pow(1.055 * x, 1.0 / 2.4 - 0.055)
		else return 12.92 * x
	})
}
