import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import React, { PureComponent } from 'react'
import { Mutation, Query } from 'react-apollo'
import Primary from '../layouts/primary'
import LoadingIndicator from '../components/LoadingIndicator'
import MultiFactorSetup from '../components/MultiFactorSetup'
import RegistrationForm from '../components/RegistrationForm'
import { parseRoutingState } from '../utils/routing'

const RegistrationSteps = {
  UserData: 1,
  Multifactor: 2
}

const GET_CONFIGURATION_QUERY = gql`
  query GET_CONFIGURATION_QUERY {
    securityConfiguration {
      multifactorRequired
      passwordRequiresNumber
      passwordRequiresSymbol
      passwordRequiresLowercase
      passwordRequiresUppercase
      passwordMinimumLength
    }
    serverConfiguration {
      realmName
    }
  }
`

const REGISTER_USER_MUTATION = gql`
  mutation REGISTER_USER_MUTATION($emailAddress: String!, $firstName: String!, $lastName: String!, $password: String!, $confirm: String!, $otpSecret: String) {
    registerUser(data: { emailAddress: $emailAddress, firstName: $firstName, lastName: $lastName, password: $password, confirm: $confirm, otpSecret: $otpSecret }) {
      success
      error
    }
  }
`

class RegisterPage extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      configuration: {},
      data: {
        emailAddress: '',
        firstName: '',
        lastName: '',
        password: '',
        confirm: '',
        otpSecret: undefined
      },
      userDataValid: false,
      requireMfaVerification: false,
      step: RegistrationSteps.UserData
    }
  }

  isValid = (configuration) => {
    switch (this.state.step) {
      case RegistrationSteps.UserData:
        return this.state.userDataValid

      case RegistrationSteps.Multifactor:
        if ((this.state.requireMfaVerification || configuration.multifactorRequired) && !this.state.data.otpSecret) {
          return false
        }
        break
    }

    return true
  }

  onFormValueChanged = (name, value) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        data: {
          ...prevState.data,
          [name]: value
        }
      }
    })
  }

  onFormValidated = (isValid) => {
    this.setState({ userDataValid: isValid })
  }

  onMfaVerified = (otpSecret) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        data: {
          ...prevState.data,
          otpSecret
        }
      }
    })
  }

  onSubmitClick = async (registerUser) => {
    switch (this.state.step) {
      case RegistrationSteps.UserData:
        this.setState({ step: RegistrationSteps.Multifactor })
        break

      case RegistrationSteps.Multifactor:
        const { data } = await registerUser()
        if (data && data.registerUser) {
          if (data.registerUser.success) {
            if (this.props.router.query.state) {
              const parsedState = parseRoutingState(this.props.router.query.state)
              console.log(parsedState)
              if (parsedState) {
                this.props.router.push(parsedState)
                return
              }
            }
            this.props.router.push('/home')
          } else {
            this.setState({ error: data.registerUser.error })
          }
        }
        break
    }
  }

  setRequireMfaVerification = (enabled) => {
    this.setState({ requireMfaVerification: enabled })
  }

  render() {
    return (
      <Primary>
        <Query query={GET_CONFIGURATION_QUERY}>
          {({ data, loading, error }) => {
            if (loading) {
              return <LoadingIndicator />
            }

            const { securityConfiguration, serverConfiguration } = data

            return (
              <Mutation mutation={REGISTER_USER_MUTATION} variables={this.state.data}>
                {(registerUser, { loading, error }) => (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                    }}>
                    <div className="container" style={{ height: '100vh' }}>
                      <div className="row">
                        <div className="col col-md-8 offset-md-2">
                          <div className="card m-3" style={{ maxHeight: '95vh' }}>
                            <div className="card-header">Register for {serverConfiguration.realmName}</div>
                            <div className="card-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                              {error && <div className="alert alert-danger">{error.message}</div>}
                              {this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
                              {this.state.step === RegistrationSteps.UserData && (
                                <RegistrationForm
                                  configuration={securityConfiguration}
                                  data={this.state.data}
                                  onChange={this.onFormValueChanged}
                                  onValidated={this.onFormValidated}
                                />
                              )}
                              {this.state.step === RegistrationSteps.Multifactor && (
                                <MultiFactorSetup
                                  emailAddress={this.state.data.emailAddress}
                                  required={securityConfiguration.multifactorRequired}
                                  onCancel={() => this.setRequireMfaVerification(false)}
                                  onEnabled={() => this.setRequireMfaVerification(true)}
                                  onVerified={this.onMfaVerified}
                                />
                              )}
                            </div>
                            <div className="card-footer">
                              <div className="btn-toolbar float-right">
                                <button type="submit" className="btn btn-primary" disabled={!this.isValid(securityConfiguration)} onClick={() => this.onSubmitClick(registerUser)}>
                                  {this.state.step === RegistrationSteps.Multifactor ? 'Register' : 'Next'}
                                </button>
                              </div>
                              <div className="clearfix" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </Mutation>
            )
          }}
        </Query>
      </Primary>
    )
  }
}

export default withRouter(RegisterPage)
