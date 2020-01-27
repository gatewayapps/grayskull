const { config } = require('dotenv')
config()

module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
}
