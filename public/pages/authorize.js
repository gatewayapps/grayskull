import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

class AuthorizePage extends PureComponent {
  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  render() {
    return (
      <div>
        Hello from the authorize page!
      </div>
    )
  }
}

AuthorizePage.propTypes = {

}

export default AuthorizePage
