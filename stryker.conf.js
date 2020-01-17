// This config was generated using a preset.
// Please see the handbook for more information: https://github.com/stryker-mutator/stryker-handbook/blob/master/stryker/guides/react.md#react
module.exports = function(config) {
  config.set({
    mutate: ['{services,context}/**/*.ts', '!{services,context}/**/*.spec.ts'],
    mutator: 'typescript',
    maxConcurrentTestRunners: 8,
    testRunner: 'jest',
    reporters: ['progress', 'clear-text', 'html'],
    coverageAnalysis: 'off'
  })
}
