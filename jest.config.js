const { config } = require('dotenv')
config()

module.exports = {
	roots: ['<rootDir>'],
	setupFiles: ['<rootDir>/tests/settings/jest.crypto-setup.js'],
	testMatch: ['**/?(*.)(spec|test).ts?(x)'],
	testPathIgnorePatterns: ['node_modules'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	}
}
