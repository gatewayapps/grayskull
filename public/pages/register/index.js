import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { Mutation, Query } from 'react-apollo'
import Primary from '../../layouts/primary'
import LoadingIndicator from '../../components/LoadingIndicator'
import MultiFactorSetup from '../../components/MultiFactorSetup'
import RegistrationForm from '../../components/RegistrationForm'
import { validatePassword } from '../../utils/passwordComplexity'

const RegistrationSteps = {
  UserData: 1,
  Multifactor: 2
}

const GET_CONFIGURATION_QUERY = gql`
  query GET_CONFIGURATION_QUERY {
    configuration {
      multifactorRequired
      passwordRequireNumber
      passwordRequireSymbol
      passwordRequireLowercase
      passwordRequireUppercase
      passwordMinimumLength
    }
  }
`

const REGISTER_USER_MUTATION = gql`
  mutation REGISTER_USER_MUTATION($cpt: String!, $firstName: String!, $lastName: String!, $password: String!, $confirm: String!, $otpSecret: String) {
    registerUser(data: { cpt: $cpt, firstName: $firstName, lastName: $lastName, password: $password, confirm: $confirm, otpSecret: $otpSecret })
  }
`

class Register extends PureComponent {
  static getInitialProps = async ({ req, query, res }) => {
    return {
      query,
      ...res.locals
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      configuration: {},
      data: {
        cpt: props.query.cpt,
        firstName: '',
        lastName: '',
        password: '',
        confirm: '',
        otpSecret: undefined
      },
      emailAddress: props.emailAddress,
      requireMfaVerification: false,
      step: RegistrationSteps.UserData
    }
  }

  isValid = (configuration) => {
    switch (this.state.step) {
      case RegistrationSteps.UserData:
        if (!this.state.data.firstName || !this.state.data.lastName || !this.state.data.password || !this.state.data.confirm) {
          return false
        }
        if (!validatePassword(this.state.data.password, configuration)) {
          return false
        }
        if (this.state.data.password !== this.state.data.confirm) {
          return false
        }
        break

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
          window.location.replace(data.registerUser)
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

            const { configuration } = data

            return (
              <Mutation mutation={REGISTER_USER_MUTATION} variables={this.state.data}>
                {(registerUser, { loading, error }) => {
                  return (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                      }}>
                      <div className="container pt-4">
                        <div className="row">
                          <div className="col col-md-8 offset-md-2">
                            <div className="card">
                              <div className="card-header">Register for {this.props.client.name}</div>
                              <div className="card-body">
                                {error && <div className="alert alert-danger">{error.message}</div>}
                                <div className="form-group row">
                                  <label className="col-sm-12 col-md-3 col-form-label" htmlFor="emailAddress">
                                    E-mail Address
                                  </label>
                                  <div className="col-sm-12 col-md-9">
                                    <input
                                      type="text"
                                      readOnly
                                      className="form-control-plaintext"
                                      name="emailAddress"
                                      value={this.state.emailAddress}
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                </div>
                                {this.state.step === RegistrationSteps.UserData && (
                                  <RegistrationForm configuration={configuration} data={this.state.data} onChange={this.onFormValueChanged} />
                                )}
                                {this.state.step === RegistrationSteps.Multifactor && (
                                  <MultiFactorSetup
                                    emailAddress={this.state.emailAddress}
                                    required={configuration.multifactorRequired}
                                    onCancel={() => this.setRequireMfaVerification(false)}
                                    onEnabled={() => this.setRequireMfaVerification(true)}
                                    onVerified={this.onMfaVerified}
                                  />
                                )}
                              </div>
                              <div className="card-footer">
                                <div className="btn-toolbar float-right">
                                  <button
                                    type="submit"
                                    className="btn btn-info"
                                    disabled={!this.isValid(configuration) || loading}
                                    onClick={() => this.onSubmitClick(registerUser)}>
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
                  )
                }}
              </Mutation>
            )
          }}
        </Query>
      </Primary>
    )
  }
}

export default Register
