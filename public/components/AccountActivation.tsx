import { FormValidation, FormValidationRule, ValidateFn } from '@gatewayapps/react-form-validation'
import gql from 'graphql-tag'
import React from 'react'
import { Mutation, MutationFn } from 'react-apollo'
import { validatePassword } from '../utils/passwordComplexity'
import RequireConfiguration from './RequireConfiguration'
import ResponsiveForm from './ResponsiveForm'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import PasswordComplexity from './PasswordComplexity'
import MultiFactorSetup from './MultiFactorSetup'

const ACTIVATE_ACCOUNT_MUTATION = gql`
  mutation ACTIVATE_ACCOUNT_MUTATION($data: ActivateAccountArgs!) {
    activateAccount(data: $data) {
      success
      error
      message
    }
  }
`

enum ActivationStep {
  Password = 1,
  MFA = 2
}

interface AccountActivationProps {
  emailAddress: string
  token: string
}

interface AccountActivationState {
  accountActivated: boolean
  data: {
    password: string
    confirm: string
    otpSecret?: string
  }
  error?: string
  message?: string
  passwordValid: boolean
  showMfaForm: boolean
  requireMfaVerification: boolean
  step: ActivationStep
}

class AccountActivation extends React.PureComponent<AccountActivationProps, AccountActivationState> {
  constructor(props: AccountActivationProps) {
    super(props)
    this.state = {
      accountActivated: false,
      data: {
        password: '',
        confirm: '',
        otpSecret: undefined
      },
      error: undefined,
      message: undefined,
      passwordValid: false,
      requireMfaVerification: false,
      showMfaForm: false,
      step: ActivationStep.Password
    }
  }

  isValid = (configuration: any): boolean => {
    switch (this.state.step) {
      case ActivationStep.Password:
        return this.state.passwordValid

      case ActivationStep.MFA:
        if ((this.state.requireMfaVerification || configuration.multifactorRequired) && !this.state.data.otpSecret) {
          return false
        }
        break
    }
    return true
  }

  handleChange = (evt: any, validate: ValidateFn) => {
    const { name, value } = evt.target
    this.setState(
      (prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          [name]: value
        }
      }),
      () => {
        validate()
      }
    )
  }

  onFormValidated = (isValid: boolean) => {
    this.setState({ passwordValid: isValid })
  }

  onMfaVerified = (otpSecret: string) => {
    this.setState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        otpSecret
      }
    }))
  }

  onSubmitClick = async (activateAccount: MutationFn) => {
    switch (this.state.step) {
      case ActivationStep.Password:
        this.setState({ step: ActivationStep.MFA })
        break

      case ActivationStep.MFA:
        const result = await activateAccount()
        if (result && result.data) {
          const { activateAccount } = result.data
          this.setState({
            accountActivated: activateAccount.success,
            error: activateAccount.error,
            message: activateAccount.message
          })
        }
        break
    }
  }

  setRequireMfaVerification = (enabled: boolean) => {
    this.setState({
      requireMfaVerification: enabled,
      showMfaForm: enabled
    })
  }

  public render() {
    const mutationVariables = {
      emailAddress: this.props.emailAddress,
      token: this.props.token,
      ...this.state.data
    }

    return (
      <RequireConfiguration>
        {(configuration) => {
          const { securityConfiguration, serverConfiguration } = configuration
          const validations = [
            new FormValidationRule('newPassword', 'isEmpty', false, 'New password is required'),
            new FormValidationRule('newPassword', validatePassword, true, 'New password does not meet complexity requirements', [securityConfiguration]),
            new FormValidationRule('confirmPassword', 'isEmpty', false, 'Confirm password is required'),
            new FormValidationRule('confirmPassword', 'equals', true, 'Confirm should match the password', [this.state.data.password])
          ]

          return (
            <FormValidation validations={validations} data={this.state.data}>
              {({ validate, validationErrors }) => (
                <Mutation mutation={ACTIVATE_ACCOUNT_MUTATION} variables={mutationVariables}>
                  {(activateAccount, { loading, error }) => (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        this.onSubmitClick(activateAccount)
                      }}>
                      <ResponsiveForm
                        formHeader={<span>Activate {serverConfiguration.realmName} Account</span>}
                        formBody={
                          <div>
                            {error && <div className="alert alert-danger">{error.message}</div>}
                            {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                            {this.state.message && <div className="alert alert-success">{this.state.message}</div>}
                            {this.state.step === ActivationStep.Password && (
                              <>
                                <ResponsiveValidatingInput
                                  validationErrors={validationErrors}
                                  label="Password"
                                  autoComplete="new-password"
                                  type="password"
                                  name="password"
                                  value={this.state.data.password}
                                  onChange={(e) => this.handleChange(e, validate)}
                                />
                                <div className="alert alert-secondary border-secondary col-12 col-md-9 offset-md-3" style={{ border: '1px solid' }}>
                                  <div className="alert-heading">Password requirements</div>
                                  <div>
                                    <PasswordComplexity configuration={securityConfiguration} password={this.state.data.password} />
                                  </div>
                                </div>
                                <ResponsiveValidatingInput
                                  type="password"
                                  label="Confirm Password"
                                  validationErrors={validationErrors}
                                  autoComplete="new-password"
                                  name="confirmPassword"
                                  value={this.state.data.confirm}
                                  onChange={(e) => this.handleChange(e, validate)}
                                />
                              </>
                            )}
                            {this.state.step === ActivationStep.MFA && (
                              <div>
                                {securityConfiguration.multifactorRequired && <p>Multi-factor authentication is required to complete account registration.</p>}
                                {!this.state.showMfaForm &&
                                  !securityConfiguration.multifactorRequired && (
                                    <div>
                                      <p>Make your account more secure and require a one-time authentication code to login.</p>
                                      <button className="btn btn-primary" onClick={() => this.setRequireMfaVerification(true)}>
                                        Enable Mulit-Factor Authentication
                                      </button>
                                    </div>
                                  )}
                                {(this.state.showMfaForm || securityConfiguration.multifactorRequired) && (
                                  <MultiFactorSetup
                                    emailAddress={this.props.emailAddress}
                                    required={securityConfiguration.multifactorRequired}
                                    onCancel={() => this.setRequireMfaVerification(false)}
                                    onVerified={this.onMfaVerified}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        }
                        formFooter={
                          <div className="btn-toolbar float-right">
                            <button disabled={!this.isValid(configuration) || loading} className="btn btn-outline-success" type="submit">
                              {this.state.step === ActivationStep.MFA ? 'Activate' : 'Next'}
                            </button>
                          </div>
                        }
                      />
                    </form>
                  )}
                </Mutation>
              )}
            </FormValidation>
          )
        }}
      </RequireConfiguration>
    )
  }
}

export default AccountActivation
