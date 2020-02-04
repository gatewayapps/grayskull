import React from 'react'
// Gets the display name of a JSX component for dev tools
const getDisplayName = (Component) => Component.displayName || Component.name || 'Component'
// import { isOobe, needsFirstUser } from '../../server/utils/AuthorizationHelper'
export const ensureSetup = (WrappedComponent) =>
  class extends React.Component {
    static async getInitialProps(ctx) {
      if (ctx.res) {
        // const _isOobe = await isOobe()
        // const _needsFirstUser = await needsFirstUser()
        // if (ctx.req.url === '/' || ctx.req.url === '') {
        //   ctx.res.writeHead(302, {
        //     Location: '/personal-info'
        //   })
        //   ctx.res.end()
        // }
      }

      const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))

      return { ...componentProps }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }