import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import generateFingerprint from '../utils/generateFingerprint'

const UserContext = React.createContext({
  user: undefined,
})

export default UserContext

export class SessionProvider extends PureComponent {
  state = {
    fingerprint: undefined,
    user: undefined
  }

  async componentDidMount() {
    const fingerprint = await generateFingerprint()
    this.setState({ fingerprint })
  }

  setSession = (user) => {
    this.setState({ user })
  }

  render() {
    return (
      <SessionContext.Provider value={{ ...this.state, setSession: this.setSession }}>
        {this.props.children}
      </SessionContext.Provider>
    )
  }
}

export const SessionConsumer = (props) => (
  <SessionContext.Consumer>
    {props.children}
  </SessionContext.Consumer>
)

SessionConsumer.propTypes = {
  children: PropTypes.func.isRequired,
}
