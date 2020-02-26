import React from 'react'

export const ensureSetup = (WrappedComponent) =>
	class extends React.Component {
		static async getInitialProps(ctx) {
			const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

			return { ...componentProps }
		}

		render() {
			return <WrappedComponent {...this.props} />
		}
	}
