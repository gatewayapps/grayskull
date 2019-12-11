const withSass = require('next-dart-sass')
const withCss = require('@zeit/next-css')

module.exports = withSass(
  withCss({
    webpack(config, options) {
      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      })
      config.module.rules.push({
        test: /\.handlebars$/i,
        use: 'raw-loader'
      })
      return config
    },
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
