import 'core-js'
import { ApolloProvider } from 'react-apollo'
import App from 'next/app'
import ConfigurationContext from '../client/contexts/ConfigurationContext'
import Head from 'next/head'
import React from 'react'
import UserContext from '../client/contexts/UserContext'
import createApolloClient from '../client/utils/createApolloClient'
import { getCurrentConfiguration } from '../server/config/ConfigurationManager'

const apolloClient = createApolloClient()

export default class MyApp extends App<any> {
  state = {
    configuration: this.props.configuration,
    user: this.props.user,
    refresh: undefined
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    let configuration
    let user
    if (ctx && ctx.res && ctx.res.locals) {
      const config = await getCurrentConfiguration()
      if (!config.Server.baseUrl && ctx.req.url !== '/oobe') {
        ctx.res.writeHead(302, { Location: '/oobe' })
        ctx.res.end()
      }
      if (ctx.res.locals.NEEDS_FIRST_USER && ctx.req.url !== '/register') {
        ctx.res.writeHead(302, {
          Location: '/register'
        })
        ctx.res.end()
      }
      if (ctx.req.url === '/' || ctx.req.url === '') {
        ctx.res.writeHead(302, {
          Location: '/personal-info'
        })
        ctx.res.end()
      }
      configuration = ctx.res.locals.configuration
      user = ctx.res.locals.userContext
    }
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, configuration, user }
  }

  render() {
    const { Component, pageProps, configuration, user } = this.props

    let title = 'Grayskull'
    if (this.state.configuration && this.state.configuration.serverConfiguration) {
      title = this.state.configuration.serverConfiguration.realmName
    }
    return (
      <ApolloProvider client={apolloClient}>
        <ConfigurationContext.Provider value={this.state.configuration}>
          <UserContext.Provider
            value={{
              user: this.state.user,
              setUser: (user) => {
                this.setState({ user })
              },
              refresh: this.state.refresh,
              setRefresh: (refresh) => {
                this.setState({ refresh })
              }
            }}>
            <div>
              <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>
                  {title} {pageProps.pageTitle && '| ' + pageProps.pageTitle}
                </title>
              </Head>

              <Component {...pageProps} />
            </div>
          </UserContext.Provider>
        </ConfigurationContext.Provider>
      </ApolloProvider>
    )
  }
}
