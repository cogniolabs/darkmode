const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

module.exports = {
	input: 'src/darkmode.ts',
	output: [
		{
			file: 'dist/darkmode.cjs.js',
			format: 'cjs',
			exports: 'auto',
		},
		{
			file: 'dist/darkmode.esm.js',
			format: 'es',
		},
		{
			file: 'dist/darkmode.umd.js',
			format: 'umd',
			name: 'Darkmode',
			exports: 'auto',
		},
	],
	plugins: [typescript(), nodeResolve(), commonjs()],
};
