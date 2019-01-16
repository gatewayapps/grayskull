import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import RequireAuthentication from '../components/RequireAuthentication'
import UserContext from '../contexts/UserContext'

class AuthorizePage extends PureComponent {
  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  render() {
    return (
      <RequireAuthentication>
        <UserContext.Consumer>
          {({ user }) => (
            <div>
              Hello from the authorize page!
              {user && (
                <div>{user.firstName} {user.lastName}</div>
              )}
            </div>
          )}
        </UserContext.Consumer>
      </RequireAuthentication>
    )
  }
}

AuthorizePage.propTypes = {

}

export default AuthorizePage
