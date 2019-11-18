import 'core-js'
import { ApolloProvider, Query } from 'react-apollo'
import App from 'next/app'
import ConfigurationContext from '../client/contexts/ConfigurationContext'
import Head from 'next/head'
import React from 'react'

import UserContext from '../client/contexts/UserContext'
import createApolloClient from '../client/utils/createApolloClient'

const apolloClient = createApolloClient()



class MyApp extends App<any> {
  state = {
    configuration: this.props.configuration,
    user: this.props.user,
    refresh: undefined
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component && Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, user, configuration } = this.props

    let title = 'Grayskull'
    if (this.state.configuration && this.state.configuration.Server) {
      title = this.state.configuration.Server.realmName
    }

    return (
      <ApolloProvider client={apolloClient}>
        <Query client={client} query=
        <ConfigurationContext.Provider value={configuration}>
          <UserContext.Provider
            value={{
              user: user,
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
export default MyApp
