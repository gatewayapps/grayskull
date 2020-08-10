import 'core-js'

import { ApolloProvider } from 'react-apollo'
import App from 'next/app'

import Head from 'next/head'
import React from 'react'

import createApolloClient from '../presentation/utils/createApolloClient'

import ApplicationInitializer from '../presentation/components/ApplicationInitializer'

const apolloClient = createApolloClient()

class MyApp extends App<any> {
	state = {
		configuration: this.props.configuration,
		user: this.props.user,
		refresh: undefined
	}

	static async getInitialProps({ Component, ctx }) {
		let pageProps = {}
		let configuration: any
		if (ctx.req && ctx.res) {
			const prepareContext = (await import('../foundation/context/prepareContext')).prepareContext
			const context = await prepareContext(ctx.req, ctx.res)
			configuration = context.configuration
			process.env.GRAYSKULL_BASE_URL =
				configuration && configuration.Server && configuration.Server.baseUrl ? configuration.Server.baseUrl : null
		}

		if (Component && Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx)
		}

		return { pageProps, configuration }
	}

	render() {
		const { Component, pageProps } = this.props

		let title = 'Grayskull'
		if (this.state.configuration && this.state.configuration.Server) {
			title = this.state.configuration.Server.realmName
		}

		return (
			<ApolloProvider client={apolloClient}>
				<ApplicationInitializer configuration={this.state.configuration}>
					<div>
						<Head>
							<meta name="viewport" content="width=device-width, initial-scale=1" />
							<title>
								{title} {pageProps.pageTitle && '| ' + pageProps.pageTitle}
							</title>
						</Head>

						<Component {...pageProps} />
					</div>
				</ApplicationInitializer>
			</ApolloProvider>
		)
	}
}
export default MyApp
