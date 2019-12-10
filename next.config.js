const withSass = require('next-dart-sass')
const withCss = require('@zeit/next-css')

module.exports = withSass(
  withCss({
    experimental: {
      async rewrites() {
        return [
          { source: '/token', destination: '/api/token' },
          { source: '/userinfo', destination: '/api/userinfo' },
          { source: '/users/[userAccountId]/userinfo', destination: '/api/users/[userAccountId]/userinfo' }
        ]
      }
    },
    target: 'serverless',
    env: {
      PROJECT_ROOT: __dirname
    }
  })
)
