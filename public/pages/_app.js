import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import fetch from 'isomorphic-fetch'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { ApolloLink, Observable } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider } from 'react-apollo'
import generateFingerprint from '../utils/generateFingerprint'
import UserContext from '../contexts/UserContext'
import ConfigurationContext from '../contexts/ConfigurationContext'

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => {
          console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        })
      }
      if (networkError) {
        console.error(`[Network error]: ${networkError}`)
      }
    }),
    new ApolloLink(
      (operation, forward) =>
        new Observable((observer) => {
          let handle
          Promise.resolve(operation)
            .then(async (oper) => {
              const fingerprint = await generateFingerprint()
              oper.setContext({
                headers: {
                  'x-fingerprint': fingerprint
                }
              })
            })
            .then(() => {
              handle = forward(operation).subscribe({
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              })
            })
            .catch(observer.error.bind(observer))

          return () => {
            if (handle) {
              handle.unsubscribe()
            }
          }
        })
    ),
    createUploadLink({
      uri: '/api/graphql',
      fetch: fetch
    })
  ])
})

export default class MyApp extends App {
  state = {
    configuration: undefined,
    user: undefined
  }

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    let configuration
    if (ctx && ctx.res && ctx.res.locals) {
      if (ctx.res.locals.NEEDS_FIRST_USER && ctx.req.url !== '/register') {
        ctx.res.writeHead(302, {
          Location: '/register'
        })
        ctx.res.end()
      }
      configuration = ctx.res.locals.configuration
    }
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps, configuration }
  }

  componentDidMount() {
    this.setState({ configuration: this.props.configuration })
  }

  render() {
    const { Component, pageProps, configuration } = this.props

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <ConfigurationContext.Provider value={this.state.configuration}>
            <UserContext.Provider
              value={{
                user: this.state.user,
                setUser: (user) => {
                  this.setState({ user })
                }
              }}>
              <div>
                <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                  <title>Grayskull {pageProps.pageTitle && '| ' + pageProps.pageTitle}</title>
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
