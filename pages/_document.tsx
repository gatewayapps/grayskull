import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document<{
	styleTags: React.ReactElement<{}, string | React.JSXElementConstructor<any>>[]
}> {
	static async getInitialProps(ctx: DocumentContext) {
		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet()

		// Step 2: Retrieve styles from components in the page
		const page = ctx.renderPage((App) => (props) => sheet.collectStyles(<App {...props} />))

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement()

		// Step 4: Pass styleTags as a prop
		return { ...page, styleTags }
	}

	render() {
		return (
			<Html>
				<Head>
					<script type="text/javascript" src="/__fp2.js" />
					<script type="text/javascript" src="/scripts/jquery.min.js" />
					<script type="text/javascript" src="/scripts/popper.min.js" />
					<script type="text/javascript" src="/scripts/bootstrap.min.js" />

					<style>{`body { margin: 0 } /* custom! */`}</style>
					<link rel="stylesheet" href="/fontawesome-pro/css/all.min.css" />

					{this.props.styleTags}
				</Head>
				<body className="custom_class">
					<Main />
					<NextScript />
				</body>
				<script type="text/javascript" src="/scripts/inert.js" />
			</Html>
		)
	}
}
