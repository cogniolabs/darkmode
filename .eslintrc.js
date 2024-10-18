module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		jest: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{ argsIgnorePattern: '^_' },
		],
	},
	overrides: [
		{
			files: ['**/*.js'],
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
			},
		},
	],
	ignorePatterns: ['dist/**', '*.min.js', 'node_modules/**'],
};
