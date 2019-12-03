import { withRouter } from 'next/router'
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
            const state = generateRoutingState(this.props.router)
            window.location.replace(`/login?state=${state}`)
          } else {
            return this.props.children
          }
        }}
      </UserContext.Consumer>
    )
  }
}

export default withRouter(RequireAuthentication)
