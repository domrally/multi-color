export function Polar(ab: { a: number; b: number }) {
	const { a, b } = ab
	return {
		C: Math.sqrt(a * a + b * b),
		h: Math.atan2(b, a),
	}
}
