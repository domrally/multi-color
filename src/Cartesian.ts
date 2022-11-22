export function Cartesian(hC: { h: number; C: number }) {
	const { h, C } = hC
	return {
		a: C * Math.cos(h),
		b: C * Math.sin(h),
	}
}
