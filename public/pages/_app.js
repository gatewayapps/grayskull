import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import { ApolloProvider } from 'react-apollo'
import createApolloClient from '../utils/createApolloClient'
import UserContext from '../contexts/UserContext'
import ConfigurationContext from '../contexts/ConfigurationContext'

const apolloClient = createApolloClient()

export default class MyApp extends App {
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
      <Container>
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
      </Container>
    )
  }
}
