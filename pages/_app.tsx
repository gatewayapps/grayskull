import 'core-js'
import { ApolloProvider, Query } from 'react-apollo'
import App from 'next/app'
import ConfigurationContext from '../client/contexts/ConfigurationContext'
import Head from 'next/head'
import React from 'react'

import UserContext from '../client/contexts/UserContext'
import createApolloClient from '../client/utils/createApolloClient'
import { WithInitialization } from '../client/components/WithInitialization'
import ApplicationInitializer from '../client/components/ApplicationInitializer'

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
    if (ctx.req) {
      const configManager = await import('../server/config/ConfigurationManager')

      configuration = await configManager.getCurrentConfiguration(true)
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
