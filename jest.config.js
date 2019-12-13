module.exports = {
  roots: ['<rootDir>/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.ts',
    '!dist',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!server',
    '!pages',
    '!public',
    '!client'
  ]
}
