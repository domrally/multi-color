import resolve from '@rollup/plugin-node-resolve'

export default {
	input: 'dist/src/index.js',
	output: {
		compact: true,
		file: 'index.js',
		format: 'es',
	},
	plugins: [resolve()],
}
