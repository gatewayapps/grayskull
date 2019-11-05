import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  // static getInitialProps({ renderPage }) {
  //   const sheet = new ServerStyleSheet()
  //   const page = renderPage((App) => (props) => sheet.collectStyles(<App {...props} />))
  //   const styleTags = sheet.getStyleElement()
  //   return { ...page, styleTags }
  // }

  render() {
    return (
      <html>
        <Head>
          <script type="text/javascript" src="/scripts/jquery.min.js" />
          <script type="text/javascript" src="/scripts/popper.min.js" />
          <script type="text/javascript" src="/scripts/bootstrap.min.js" />
          <style>{`body { margin: 0 } /* custom! */`}</style>
          <script type="text/javascript" src="/__fp2.js" />

          <link rel="stylesheet" href="/fontawesome-pro/css/all.min.css" />
          <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1" />
        </Head>
        <body className="custom_class">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
