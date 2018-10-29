const cradle = require('@gatewayapps/cradle')

const loaderOptions = new cradle.LoaderOptions(
  'spec',
  {
    source: './cradle/cradle.yml'
  },
  console
)

const emitterOptions = require('./cradle/emitters')

module.exports = new cradle.CradleConfig(loaderOptions, emitterOptions)
