const webpack = require('webpack')

const packageInfo = require('./package.json')

module.exports = {
	typescript: {
		ignoreDevErrors: true
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.(graphql|gql)$/,
			exclude: /node_modules/,
			loader: 'graphql-tag/loader'
		})
		config.module.rules.push({
			test: /\.(handlebars|txt)$/i,
			use: 'raw-loader'
		})

		config.plugins.push(new webpack.IgnorePlugin(/^pg-native$/))

		return config
	},
	experimental: {
		async rewrites() {
			return [
				{ source: '/.well-known/jwks.json', destination: '/api/.well-known/jwks.json' },
				{ source: '/.well-known/openid-configuration', destination: '/api/.well-known/openid-configuration' },
				{ source: '/token', destination: '/api/token' },
				{ source: '/userinfo', destination: '/api/userinfo' },
				{ source: '/users/:userAccountId/userinfo', destination: '/api/users/:userAccountId/userinfo' }
			]
		}
	},
	env: {
		PROJECT_ROOT: __dirname,
		PRODUCT_VERSION: packageInfo.version
	}
}
