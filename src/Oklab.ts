/**
 * https://bottosson.github.io/posts/oklab/
 */
export function Oklab(rgb: { r: number; g: number; b: number }) {
	const { r, g, b } = rgb,
		l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
		m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
		s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
		l3 = Math.cbrt(l),
		m3 = Math.cbrt(m),
		s3 = Math.cbrt(s)

	return {
		L: 0.2104542553 * l3 + 0.793617785 * m3 - 0.0040720468 * s3,
		a: 1.9779984951 * l3 - 2.428592205 * m3 + 0.4505937099 * s3,
		b: 0.0259040371 * l3 + 0.7827717662 * m3 - 0.808675766 * s3,
	}
}
