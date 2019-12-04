import { withRouter, default as Router } from 'next/router'
import React, { Component } from 'react'

import UserContext from '../contexts/UserContext'
import { generateRoutingState } from '../utils/routing'

class RequireAuthentication extends Component {
  state = {
    initialized: false,
    user: undefined
  }

  render() {
    return (
      <UserContext.Consumer>
        {({ user }) => {
          if (!user) {
            console.log('REDIRECTING TO login')
            const state = generateRoutingState(this.props.router)
            Router.push(`/login?state=${state}`)
          } else {
            return this.props.children
          }
        }}
      </UserContext.Consumer>
    )
  }
}

export default withRouter(RequireAuthentication)
