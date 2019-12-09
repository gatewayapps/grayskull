const withSass = require('next-dart-sass')
const withCss = require('@zeit/next-css')

module.exports = withSass(
  withCss({
    experimental: {
      async rewrites() {
        return [{ source: '/token', destination: '/api/token' }]
      }
    },
    target: 'serverless',
    env: {
      PROJECT_ROOT: __dirname
    }
  })
)
