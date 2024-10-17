module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	moduleFileExtensions: ['ts', 'js'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
};
