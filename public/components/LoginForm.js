import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Mutation } from 'react-apollo'
import generateFingerprint from '../utils/generateFingerprint'

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION(
    $emailAddress: String!
    $password: String!
    $otpToken: String
    $fingerprint: String!
  ) {
    login(
      data: {
        emailAddress: $emailAddress
        password: $password
        otpToken: $otpToken
        fingerprint: $fingerprint
      }
    ) {
      success
      message
      otpRequired
    }
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
    backupCodeSent: false
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

  render() {
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(login, { error, loading }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}>
            <div className='card'>
              <div className='card-header'>Login to {this.props.client.name}</div>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-3'>{this.props.client.logoImageUrl && <img src={this.props.client.logoImageUrl} style={{ width: '100%' }} />}</div>
                  <div className='col-9'>
                    {!this.state.otpRequired && (
                      <>
                        <div className='form-group'>
                          <label htmlFor='name'>E-mail Address:</label>
                          <input type='email' className='form-control' name='emailAddress' value={this.state.emailAddress} onChange={this.handleChange} />
                        </div>
                        <div className='form-group'>
                          <label htmlFor='password'>Password:</label>
                          <input type='password' className='form-control' name='password' value={this.state.password} onChange={this.handleChange} />
                        </div>
                      </>
                    )}
                    {this.state.otpRequired && (
                      <div className='form-group'>
                        <label htmlFor='otpToken'>Multi-Factor Authentication Code:</label>
                        <input type='text' className='form-control' name='otpToken' value={this.state.otpToken} onChange={this.handleChange} />
                        {this.state.backupCodeSent && <div>A backup code has been sent to your email address.</div>}
                        <Mutation mutation={SEND_BACKUP_CODE_MUTATION} variables={{ emailAddress: this.state.emailAddress }}>
                          {(sendBackupCode, { loading }) => (
                            <button className='btn btn-link pl-0' disabled={loading} onClick={() => this.onSendBackupCode(sendBackupCode)}>
                              {this.state.backupCodeSent ? 'Send new backup code' : "I don't have access to my authenticator right now"}
                            </button>
                          )}
                        </Mutation>
                      </div>
                    )}
                    {this.state.message && <div className='alert alert-info'>{this.state.message}</div>}
                    {error && error.message && <div className='alert alert-danger'>{error.message}</div>}
                  </div>
                </div>
              </div>
              <div className='card-footer'>
                <div className='btn-toolbar float-left'>
                  <a href='/resetPassword' className='btn btn-link'>
                    Forgot Password
                  </a>
                </div>
                <div className='btn-toolbar float-right'>
                  <button type='submit' className='btn btn-outline-info' disabled={loading} onClick={() => this.attemptLogin(login)}>
                    <i className='fal fa-sign-in' /> Login
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </Mutation>
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

export default LoginForm
