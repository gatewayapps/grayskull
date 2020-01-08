module.exports = {
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
}
