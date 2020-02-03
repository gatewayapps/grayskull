import React, { Component, useState } from 'react'
import absoluteUrl from 'next-absolute-url'

const getDisplayName = (Component) => Component.displayName || Component.name || 'Component'

export const WithInitialization = (WrappedComponent) => {
  const initializationWrapper = (props) => {
    const { propsUser, propsConfiguration, ...renderProps } = props
    const [user, setUser] = useState(propsUser)
    const [configuration, setConfiguration] = useState(propsConfiguration)

    return <WrappedComponent {...renderProps} user={user} configuration={configuration} />
  }
  initializationWrapper.displayName = `withInitialization(${getDisplayName(WrappedComponent)})`
  initializationWrapper.getInitialProps = async ({ ctx }) => {
    let result
    if (ctx.req) {
      const { protocol, host } = absoluteUrl(ctx.req)
      const initializeResponse = await fetch(`${protocol}//${host}/api/initialize`)
      result = await initializeResponse.json()
    }
    const componentProps = WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx))
    return { ...componentProps, user: result.user, configuration: result.configuration }
  }

  return initializationWrapper
}
