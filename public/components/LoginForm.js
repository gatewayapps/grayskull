import Link from 'next/link'
import { withRouter } from 'next/router'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import generateFingerprint from '../utils/generateFingerprint'
import RequireConfiguration from './RequireConfiguration'
import ResponsiveForm from './ResponsiveForm'
import ResponsiveInput from './ResponsiveInput'

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION($emailAddress: String!, $password: String!, $otpToken: String, $fingerprint: String!) {
    login(data: { emailAddress: $emailAddress, password: $password, otpToken: $otpToken, fingerprint: $fingerprint }) {
      success
      message
      otpRequired
      emailVerificationRequired
    }
  }
`

const RESEND_VERIFICATION_MUTATION = gql`
  mutation RESEND_VERIFICATION_MUTATION($emailAddress: String!) {
    resendVerification(data: { emailAddress: $emailAddress })
  }
`

const SEND_BACKUP_CODE_MUTATION = gql`
  mutation SEND_BACKUP_CODE_MUTATION($emailAddress: String!) {
    sendBackupCode(data: { emailAddress: $emailAddress })
  }
`

class LoginForm extends PureComponent {
  state = {
    emailAddress: '',
    password: '',
    otpToken: '',
    fingerprint: '',
    otpRequired: false,
    message: undefined,
    backupCodeSent: false,
    emailVerificationRequired: false,
    emailVerificationSent: false
  }

  async componentDidMount() {
    const fingerprint = await generateFingerprint()
    this.setState({ fingerprint })
  }

  attemptLogin = async (login) => {
    const variables = {
      emailAddress: this.state.emailAddress,
      password: this.state.password,
      otpToken: this.state.otpToken,
      fingerprint: this.state.fingerprint
    }

    const { data } = await login({ variables })
    if (data && data.login) {
      if (data.login.success === true) {
        this.props.onAuthenticated()
      } else if (data.login.otpRequired === true) {
        this.setState({ otpRequired: true, message: data.login.message })
      } else if (data.login.emailVerificationRequired === true) {
        this.setState({ emailVerificationRequired: true, message: data.login.message })
      } else {
        this.setState({ message: data.login.message })
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSendBackupCode = async (sendBackupCode) => {
    const { data } = await sendBackupCode()
    if (data && data.sendBackupCode) {
      this.setState({ backupCodeSent: true })
    }
  }

  onSendVerificationEmail = async (sendVerification) => {
    const { data } = await sendVerification()

    if (data && data.resendVerification) {
      this.setState({ emailVerificationSent: true })
    }
  }

  render() {
    return (
      <RequireConfiguration>
        {(configuration) => {
          return (
            <Mutation mutation={LOGIN_MUTATION}>
              {(login, { error, loading }) => (
                <form
                  autocomplete="off"
                  onSubmit={(e) => {
                    e.preventDefault()
                  }}>
                  <ResponsiveForm
                    formHeader={
                      <span>
                        <img className="d-inline d-md-none header-logo mr-2" src={this.props.client.logoImageUrl} />
                        Login to {this.props.client.name}
                      </span>
                    }
                    formBody={
                      <div className="row">
                        <div className="d-none d-md-block col-md-4 text-center">
                          {this.props.client.logoImageUrl && <img className="body-logo align-self-start w-100 my-2" src={this.props.client.logoImageUrl} />}
                        </div>
                        <div className="col-12 col-md-8 ">
                          {!this.state.otpRequired && (
                            <div>
                              <ResponsiveInput
                                autoComplete="nope"
                                name="emailAddress"
                                type="email"
                                label="E-mail Address"
                                value={this.state.emailAddress}
                                onChange={this.handleChange}
                                autoFocus
                              />

                              <ResponsiveInput type="password" name="password" value={this.state.password} onChange={this.handleChange} label="Password" />

                              {configuration.securityConfiguration.allowSignup && (
                                <div>
                                  Need an account?
                                  <Link href={{ pathname: '/register', query: this.props.router.query }}>
                                    <a className="ml-2">Create one!</a>
                                  </Link>
                                </div>
                              )}
                              <div className="mt-3">
                                <Link href="/resetPassword">
                                  <a>Forgot Password</a>
                                </Link>

                                {this.state.emailVerificationRequired &&
                                  !this.state.emailVerificationSent && (
                                    <div className="d-inline ml-2">
                                      <Mutation mutation={RESEND_VERIFICATION_MUTATION} variables={{ emailAddress: this.state.emailAddress }}>
                                        {(sendVerification, { loading }) => (
                                          <button
                                            type="button"
                                            disabled={loading}
                                            onClick={() => this.onSendVerificationEmail(sendVerification)}
                                            className="btn btn-link text-danger">
                                            Re-send Verification E-Mail
                                          </button>
                                        )}
                                      </Mutation>
                                    </div>
                                  )}
                                {this.state.emailVerificationSent && <div className="alert alert-secondary">A verification e-mail has been sent to {this.state.emailAddress}</div>}
                              </div>
                            </div>
                          )}
                          {this.state.otpRequired && (
                            <div className="form-group">
                              <label htmlFor="otpToken">Multi-Factor Authentication Code:</label>
                              <input type="text" className="form-control" name="otpToken" value={this.state.otpToken} onChange={this.handleChange} />
                              {this.state.backupCodeSent && <div>A backup code has been sent to your email address.</div>}
                              <Mutation mutation={SEND_BACKUP_CODE_MUTATION} variables={{ emailAddress: this.state.emailAddress }}>
                                {(sendBackupCode, { loading }) => (
                                  <button className="btn btn-link pl-0" disabled={loading} onClick={() => this.onSendBackupCode(sendBackupCode)}>
                                    {this.state.backupCodeSent ? 'Send new backup code' : "I don't have access to my authenticator right now"}
                                  </button>
                                )}
                              </Mutation>
                            </div>
                          )}
                          {this.state.message && <div className="alert alert-info">{this.state.message}</div>}
                          {error && error.message && <div className="alert alert-danger">{error.message}</div>}
                        </div>
                      </div>
                    }
                    formFooter={
                      <div className="btn-toolbar float-right">
                        <button type="submit" className="btn btn-outline-info" disabled={loading} onClick={() => this.attemptLogin(login)}>
                          <i className="fal fa-sign-in" /> Login
                        </button>
                      </div>
                    }
                  />
                </form>
              )}
            </Mutation>
          )
        }}
      </RequireConfiguration>
    )
  }
}

LoginForm.propTypes = {
  client: PropTypes.shape({
    client_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logoImageUrl: PropTypes.string.isRequired
  }).isRequired,
  onAuthenticated: PropTypes.func.isRequired
}

export default withRouter(LoginForm)
