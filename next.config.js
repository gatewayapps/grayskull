const withSass = require('next-dart-sass')
const withCss = require('@zeit/next-css')

module.exports = withSass(
  withCss({
    serverRuntimeConfig: {
      PROJECT_ROOT: __dirname
    }
  })
)
