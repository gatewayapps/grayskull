import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import fetch from 'isomorphic-fetch'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  fetch: fetch
})

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <div>
            <Head>
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <title>Grayskull {pageProps.pageTitle && '| ' + pageProps.pageTitle}</title>
            </Head>

            <Component {...pageProps} />
          </div>
        </ApolloProvider>
      </Container>
    )
  }
}
