import React from 'react'
import App, { Container } from 'next/app'
import Head from 'next/head'
import fetch from 'isomorphic-fetch'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import generateFingerprint from '../utils/generateFingerprint'

const apolloClient = new ApolloClient({
  uri: '/api/graphql',
  fetch: fetch,
  request: async (operation) => {
    const fingerprint = await generateFingerprint()
    operation.setContext({
      headers: {
        'x-fingerprint': fingerprint
      }
    })
  }
})

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (ctx && ctx.res && ctx.res.locals) {
      if (ctx.res.locals.NEEDS_FIRST_USER && ctx.req.url !== '/register') {
        ctx.res.writeHead(302, {
          Location: '/register'
        })
        ctx.res.end()
      }
    }
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
