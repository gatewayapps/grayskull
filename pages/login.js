import React from 'react'
import { withRouter } from 'next/router'
import BackgroundCover from '../client/components/BackgroundCover'

import LoginForm from '../client/components/LoginForm'
import Primary from '../client/layouts/primary'
import { parseRoutingState } from '../client/utils/routing'

class LoginPage extends React.PureComponent {
  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  onAuthenticated = () => {
    if (this.props.router.query.state) {
      const parsedState = parseRoutingState(this.props.router.query.state)
      if (parsedState) {
        this.props.router.push(parsedState)
        return
      }
    }
    this.props.router.push('/')
  }

  render() {
    let headerMessage
    if (this.props.query.emailVerified) {
      headerMessage = <div className="alert alert-success">E-mail address verified</div>
    }

    return (
      <Primary>
        <BackgroundCover>
          <div className="container">
            {headerMessage}
            <LoginForm onAuthenticated={this.onAuthenticated} />
          </div>
        </BackgroundCover>
      </Primary>
    )
  }
}

export default withRouter(LoginPage)
