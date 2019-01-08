import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Mutation } from 'react-apollo'
import generateFingerprint from '../utils/generateFingerprint'

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION (
    $emailAddress: String!,
    $password: String!,
    $otpToken: String,
    $sessionId: String!,
    $client_id: Int!
    $response_type: String!
    $redirect_uri: String!
    $state: String
  ) {
    login(data: {
      emailAddress: $emailAddress,
      password: $password,
      otpToken: $otpToken,
      sessionId: $sessionId,
      client_id: $client_id,
      response_type: $response_type,
      redirect_uri: $redirect_uri,
      state: $state
    }) {
      success
      message
      otpRequired
      redirectUrl
    }
  }
`

class LoginForm extends PureComponent {
  state = {
    emailAddress: '',
    password: '',
    otpToken: '',
    sessionId: '',
    otpRequired: false,
    message: undefined,
  }

  async componentDidMount() {
    const sessionId = await generateFingerprint()
    this.setState({ sessionId })
  }

  attemptLogin = async (login) => {
    const variables = {
      emailAddress: this.state.emailAddress,
      password: this.state.password,
      otpToken: this.state.otpToken,
      sessionId: this.state.sessionId,
      client_id: this.props.client.client_id,
      response_type: this.props.responseType,
      redirect_uri: this.props.redirectUri,
      state: this.props.state
    }

    const { data } = await login({ variables })
    if (data && data.login) {
      if (data.login.success === true) {
        window.location.replace(data.login.redirectUrl)
      } else if (data.login.otpRequired === true) {
        this.setState({ otpRequired: true, message: data.login.message })
      } else {
        this.setState({ message: data.login.message })
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(login, { error, loading }) => (
          <div className="card">
            <div className="card-header">
              Login to {this.props.client.name}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-3">
                  {this.props.client.logoImageUrl && (
                    <img src={this.props.client.logoImageUrl} style={{ width: '100%' }} />
                  )}
                </div>
                <div className="col-9">
                  {!this.state.otpRequired && (
                    <>
                      <div className="form-group">
                        <label htmlFor="name">E-mail Address:</label>
                        <input
                          type="email"
                          className="form-control"
                          name="emailAddress"
                          value={this.state.emailAddress}
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          value={this.state.password}
                          onChange={this.handleChange}
                        />
                      </div>
                    </>
                  )}
                  {this.state.otpRequired && (
                    <div className="form-group">
                      <label htmlFor="otpToken">Multi-Factor Authentication Code:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="otpToken"
                        value={this.state.otpToken}
                        onChange={this.handleChange}
                      />
                    </div>
                  )}
                  {this.state.message && (<div className="alert alert-info">{this.state.message}</div>)}
                  {error && error.message && (<div className="alert alert-danger">{error.message}</div>)}
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="btn-toolbar float-left">
                <a href="/resetPassword" className="btn btn-link">
                  Forgot Password
                </a>
              </div>
              <div className="btn-toolbar float-right">
                <button
                  className="btn btn-outline-info"
                  disabled={loading}
                  onClick={() => this.attemptLogin(login)}
                >
                  <i className="fal fa-sign-in" /> Login
                </button>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    )
  }
}

LoginForm.propTypes = {
  client: PropTypes.shape({
    client_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    logoImageUrl: PropTypes.string.isRequired,
  }).isRequired,
  responseType: PropTypes.string.isRequired,
  redirectUri: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
}

export default LoginForm
