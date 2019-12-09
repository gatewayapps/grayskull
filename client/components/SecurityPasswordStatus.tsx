import moment from 'moment'
import * as React from 'react'
import RequireConfiguration from './RequireConfiguration'
import FormValidation, { FormValidationRule } from './FormValidation'
import { validatePassword } from '../utils/passwordComplexity'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import ResponsiveInput from './ResponsiveInput'
import PasswordComplexity from './PasswordComplexity'
import MutationButton from './MutationButton'
import gql from 'graphql-tag'

const CHANGE_PASSWORD = gql`
  mutation CHANGE_PASSWORD($oldPassword: String!, $newPassword: String!, $confirmPassword: String!) {
    changePassword(data: { newPassword: $newPassword, confirmPassword: $confirmPassword, oldPassword: $oldPassword }) {
      success
      message
      error
    }
  }
`

export interface SecurityPasswordStatusProps {
  user: any
  refresh: any
}

export interface SecurityPasswordStatusState {
  changing: boolean
  isValid: boolean
  oldPassword: string
  newPassword: string
  confirmPassword: string
  passwordChanged: boolean
  message: string
}

export default class SecurityPasswordStatus extends React.Component<SecurityPasswordStatusProps, SecurityPasswordStatusState> {
  constructor(props: SecurityPasswordStatusProps) {
    super(props)

    this.state = {
      changing: false,
      newPassword: '',
      oldPassword: '',
      confirmPassword: '',
      isValid: false,
      passwordChanged: false,
      message: ''
    }
  }

  public handleChange = (e: { target: { name: string; value: any } }, validate: any) => {
    const currentState = this.state
    currentState[e.target.name] = e.target.value
    this.setState(currentState)
    validate()
  }

  onValidated = (isValid) => {
    this.setState({ isValid })
  }

  private renderDefault = () => {
    return (
      <div>
        <ResponsiveInput label="Last Changed" value={moment(this.props.user.lastPasswordChange).fromNow()} type="static" className="form-control form-control-static" readOnly />
        {this.state.passwordChanged && <div className="alert alert-success mx-4">Your password has been changed.</div>}
      </div>
    )
  }

  private renderEdit = () => {
    return (
      <RequireConfiguration>
        {(configuration) => {
          const { Security: securityConfiguration } = configuration
          const validations = [
            new FormValidationRule('oldPassword', 'isEmpty', false, 'Current password is required'),
            new FormValidationRule('newPassword', 'isEmpty', false, 'New password is required'),
            new FormValidationRule('newPassword', 'equals', false, 'New password cannot be the same as the current one', [this.state.oldPassword]),
            new FormValidationRule('newPassword', validatePassword, true, 'New password does not meet complexity requirements', [securityConfiguration]),
            new FormValidationRule('confirmPassword', 'isEmpty', false, 'Confirm password is required'),
            new FormValidationRule('confirmPassword', 'equals', true, 'Confirm should match the password', [this.state.newPassword])
          ]
          return (
            <FormValidation validations={validations} data={this.state} onValidated={this.onValidated}>
              {({ validate, validationErrors }) => (
                <div>
                  <ResponsiveValidatingInput
                    validationErrors={validationErrors}
                    label="Current Password"
                    autoComplete="current-password"
                    type="password"
                    name="oldPassword"
                    value={this.state.oldPassword}
                    onChange={(e) => this.handleChange(e, validate)}
                  />

                  <ResponsiveValidatingInput
                    validationErrors={validationErrors}
                    label="New Password"
                    autoComplete="new-password"
                    type="password"
                    name="newPassword"
                    value={this.state.newPassword}
                    onChange={(e) => this.handleChange(e, validate)}
                  />

                  <div className="alert alert-secondary border-secondary col-12 col-md-9 offset-md-3" style={{ border: '1px solid' }}>
                    <div className="alert-heading">Password requirements</div>
                    <div>
                      <PasswordComplexity configuration={securityConfiguration} password={this.state.newPassword} />
                    </div>
                  </div>

                  <ResponsiveValidatingInput
                    type="password"
                    label="Confirm Password"
                    validationErrors={validationErrors}
                    autoComplete="new-password"
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                  {this.state.message && <div className="alert alert-danger mx-4">{this.state.message}</div>}
                </div>
              )}
            </FormValidation>
          )
        }}
      </RequireConfiguration>
    )
  }

  public render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Password</h5>
          {this.state.changing ? this.renderEdit() : this.renderDefault()}
        </div>
        <div className="card-footer">
          <div className="btn-toolbar float-right">
            <button
              className="btn btn-secondary"
              onClick={() => {
                this.setState({ changing: !this.state.changing, newPassword: '', oldPassword: '', confirmPassword: '', message: '', passwordChanged: false })
              }}>
              {this.state.changing ? (
                <span>
                  <i className="fa fa-fw fa-times" /> Cancel
                </span>
              ) : (
                <span>
                  <i className="fa fa-fw fa-key" /> Change Password
                </span>
              )}
            </button>

            {this.state.changing && (
              <MutationButton
                disabled={!this.state.isValid}
                className="btn btn-success ml-2"
                mutation={CHANGE_PASSWORD}
                onSuccess={(data) => {
                  const result = data.data.changePassword
                  if (result.success) {
                    if (this.props.refresh) {
                      this.props.refresh()
                    }
                    this.setState({ passwordChanged: true, changing: false, newPassword: '', oldPassword: '', confirmPassword: '' })
                  } else {
                    this.setState({ message: result.message })
                  }
                }}
                onFail={(err) => {
                  this.setState({ message: err.message })
                }}
                variables={{ newPassword: this.state.newPassword, oldPassword: this.state.oldPassword, confirmPassword: this.state.confirmPassword }}
                busyContent={
                  <span>
                    <i className="fa fa-spin fa-fw fa-spinner" /> Changing
                  </span>
                }
                content={
                  <span>
                    <i className="fa fa-fw fa-key" /> Save Password
                  </span>
                }
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}
