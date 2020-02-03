import { withRouter, default as Router } from 'next/router'
import React, { Component } from 'react'
import LogRocket from 'logrocket'
import UserContext from '../contexts/UserContext'
import { generateRoutingState } from '../utils/routing'
import LoadingIndicator from './LoadingIndicator'

class RequireAuthentication extends Component {
  state = {
    initialized: false,
    user: undefined
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ user, hasInitialized }) => {
          if (!user && hasInitialized) {
            LogRocket.log('Redirecting to login from RequireAuthentication')
            const state = generateRoutingState(this.props.router)
            Router.push(`/login?state=${state}`)
          } else {
            if (!hasInitialized) {
              return <LoadingIndicator message="Loading..." />
            } else {
              return this.props.children
            }
          }
        }}
      </UserContext.Consumer>
    )
  }
}

export default withRouter(RequireAuthentication)
