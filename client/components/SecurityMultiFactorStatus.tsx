import gql from 'graphql-tag'
import React from 'react'
import MutationButton from './MutationButton'
import MultiFactorSetup from './MultiFactorSetup'
import ResponsiveInput from './ResponsiveInput'
import RequireConfiguration from './RequireConfiguration'

const SET_OTP_SECRET = gql`
  mutation SET_OTP_SECRET($otpSecret: String!, $password: String!) {
    setOtpSecret(data: { otpSecret: $otpSecret, password: $password }) {
      success
      message
      error
    }
  }
`

export interface SecurityMutifactorStatusProps {
  user: any
  refresh: any
}

export interface SecurityMutifactorStatusState {
  changing: boolean
  promptForChange: boolean
  promptForDisable: boolean
  isValid: boolean
  password: string
  message: string
  otpSecret: string
  otpUpdated: boolean
}

export default class SecurityMutifactorStatus extends React.Component<
  SecurityMutifactorStatusProps,
  SecurityMutifactorStatusState
> {
  constructor(props: SecurityMutifactorStatusProps) {
    super(props)

    this.state = {
      changing: false,
      promptForChange: false,
      promptForDisable: false,
      password: '',
      isValid: false,
      message: '',
      otpSecret: '',
      otpUpdated: false
    }
  }

  renderChangeForm = () => {
    return (
      <div>
        <MultiFactorSetup
          emailAddress={this.props.user.emailAddress}
          required={true}
          onVerified={(otpSecret) => {
            this.setState({ otpSecret: otpSecret })
          }}
        />
        <div className="mx-4 px-4">
          <ResponsiveInput
            label="Enter your password"
            value={this.state.password}
            onChange={(e) => {
              this.setState({ password: e.target.value })
            }}
            type="password"
          />

          {this.state.message && <div className="alert alert-danger">{this.state.message}</div>}
        </div>
      </div>
    )
  }

  renderChangePrompt = () => {
    return (
      <div className="alert alert-danger">
        You already have an authenticator app configured. If you proceed, your existing authenticator app will no longer
        work.
      </div>
    )
  }
  renderChangePromptFooter = () => {
    return (
      <div className="btn-toolbar ml-auto">
        <button
          className="btn btn-secondary mr-2"
          onClick={() => {
            this.setState({ changing: false, promptForChange: false, message: '', password: '', otpUpdated: false })
          }}>
          <i className="fa fa-fw fa-times" /> Never Mind!
        </button>

        <button
          className="btn btn-success"
          onClick={() => {
            this.setState({ changing: true, promptForChange: false })
          }}>
          <i className="fa fa-fw fa-check" /> I Understand, Proceed
        </button>
      </div>
    )
  }

  renderDisable = () => {
    return (
      <div>
        <div className="alert alert-danger">
          You already have an authenticator app configured. If you proceed, your existing authenticator app will no
          longer work.
        </div>
        <div className="m-4 px-4">
          <ResponsiveInput
            label="Enter your password"
            value={this.state.password}
            onChange={(e) => {
              this.setState({ password: e.target.value })
            }}
            type="password"
          />
        </div>
      </div>
    )
  }

  renderDisableFooter = () => {
    return (
      <div className="btn-toolbar ml-auto">
        <button
          className="btn btn-secondary mr-2"
          onClick={() => {
            this.setState({ changing: false, promptForChange: false, message: '', password: '', otpUpdated: false })
          }}>
          <i className="fa fa-fw fa-times" /> Never Mind!
        </button>

        <MutationButton
          mutation={SET_OTP_SECRET}
          variables={{ password: this.state.password, otpSecret: '' }}
          className="btn btn-danger"
          disabled={!this.state.password}
          onFail={(err) => {
            alert(err)
          }}
          onSuccess={(result) => {
            if (result.data.setOtpSecret.success) {
              this.setState({
                promptForDisable: false,
                changing: false,
                otpUpdated: false,
                password: '',
                otpSecret: ''
              })
              this.props.refresh()
            } else {
              this.setState({ message: result.data.setOtpSecret.message })
            }
          }}
          busyContent={
            <span>
              <i className="fa fa-fw fa-spin fa-spinner" /> Disabling
            </span>
          }
          content={
            <span>
              <i className="fa fa-fw fa-save" /> I Understand, Disable App
            </span>
          }
        />
      </div>
    )
  }

  renderDefault = () => {
    return (
      <div>
        <ResponsiveInput
          label="Status"
          value={this.props.user.otpEnabled ? 'Configured' : 'Not Configured'}
          type="static"
          className="form-control form-control-static"
          readOnly
        />
        {this.state.otpUpdated && (
          <div className="alert alert-success mx-4">Your account is now protected by an Authenticator App.</div>
        )}
      </div>
    )
  }

  renderChangeFooter = () => {
    return (
      <div className="btn-toolbar ml-auto">
        <button
          className="btn btn-secondary mr-2"
          onClick={() => {
            this.setState({ changing: false, message: '', password: '', otpUpdated: false })
          }}>
          <i className="fa fa-fw fa-times" /> Cancel
        </button>

        <MutationButton
          mutation={SET_OTP_SECRET}
          variables={{ password: this.state.password, otpSecret: this.state.otpSecret }}
          className="btn btn-success"
          disabled={!this.state.otpSecret}
          onFail={(err) => {
            alert(err)
          }}
          onSuccess={(result) => {
            if (result.data.setOtpSecret.success) {
              this.setState({ changing: false, otpUpdated: true, password: '', otpSecret: '' })
              this.props.refresh()
            } else {
              this.setState({ message: result.data.setOtpSecret.message })
            }
          }}
          busyContent={
            <span>
              <i className="fa fa-fw fa-spin fa-spinner" /> Updating
            </span>
          }
          content={
            <span>
              <i className="fa fa-fw fa-save" /> Update Configuration
            </span>
          }
        />
      </div>
    )
  }

  renderDefaultFooter = () => {
    return (
      <RequireConfiguration>
        {(configuration) => {
          return (
            <div className="btn-toolbar ml-auto">
              {this.props.user.otpEnabled && !configuration.Security.multifactorRequired && (
                <button
                  className="btn btn-danger mr-2"
                  onClick={() => {
                    this.setState({ promptForDisable: true })
                  }}>
                  <i className="fa fa-fw fa-skull-crossbones" /> Disable
                </button>
              )}
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (this.props.user.otpEnabled) {
                    this.setState({ promptForChange: true })
                  } else {
                    this.setState({ changing: true })
                  }
                }}>
                <i className="fa fa-fw fa-wrench" /> Configure App
              </button>
            </div>
          )
        }}
      </RequireConfiguration>
    )
  }

  render = () => {
    let footer
    let body

    if (this.state.changing) {
      footer = this.renderChangeFooter()
      body = this.renderChangeForm()
    }
    if (this.state.promptForChange) {
      footer = this.renderChangePromptFooter()
      body = this.renderChangePrompt()
    }
    if (this.state.promptForDisable) {
      footer = this.renderDisableFooter()
      body = this.renderDisable()
    }
    if (!this.state.changing && !this.state.promptForChange && !this.state.promptForDisable) {
      footer = this.renderDefaultFooter()
      body = this.renderDefault()
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            Authenticator App
            {this.props.user.otpEnabled ? (
              <i className="ml-2 text-success fa fa-fw fa-shield-check" />
            ) : (
              <i className="ml-2 text-danger fa fa-fw fa-exclamation-triangle" />
            )}
          </h5>
          {body}
        </div>
        <div className="card-footer d-flex">{footer}</div>
      </div>
    )
  }
}
