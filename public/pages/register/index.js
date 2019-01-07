import gql from 'graphql-tag'
import React, { PureComponent } from 'react'
import { Mutation } from 'react-apollo'
import Primary from '../../layouts/primary'
import MultiFactorSetup from '../../components/MultiFactorSetup'
import RegistrationForm from '../../components/RegistrationForm'

const RegistrationSteps = {
  UserData: 1,
  Multifactor: 2
}

const REGISTER_USER_MUTATION = gql`
  mutation REGISTER_USER_MUTATION($cpt: String!, $firstName: String!, $lastName: String!, $password: String!, $confirm: String!, $otpSecret: String) {
    registerUser(data: {
      cpt: $cpt,
      firstName: $firstName,
      lastName: $lastName,
      password: $password,
      confirm: $confirm,
      otpSecret: $otpSecret
    })
  }
`

class Register extends PureComponent {
  static getInitialProps = async ({ req, query, res }) => {
    return { data: req.body, query, emailAddress: res.locals.emailAddress, ...res.locals }
  }

  constructor(props) {
    super(props)
    this.state = {
      emailAddress: props.emailAddress,
      data: {
        cpt: this.props.query.cpt,
        firstName: '',
        lastName: '',
        password: '',
        confirm: '',
        otpSecret: undefined,
      },
      step: RegistrationSteps.UserData
    }
  }

  isValid = () => {
    switch (this.state.step) {
      case RegistrationSteps.UserData:
        if (!this.state.data.firstName || !this.state.data.lastName || !this.state.data.password || !this.state.data.confirm) {
          return false
        }
        if (this.state.data.password !== this.state.data.confirm) {
          return false
        }
        // TODO: Add Password Complexity Verification to UI
        break

      case RegistrationSteps.Multifactor:
        // TODO: Check if MFA requried and otpSecret has been set
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
          [name]: value,
        },
      }
    })
  }

  onMfaVerified = (otpSecret) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        data: {
          ...prevState.data,
          otpSecret,
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
        break;
    }
  }

  render() {
    return (
      <Primary>
        <Mutation mutation={REGISTER_USER_MUTATION} variables={this.state.data}>
          {(registerUser, { loading, error }) => {
            return (
              <div>
                <div className="container pt-4">
                  <div className="row">
                    <div className="col col-md-8 offset-md-2">
                      <div className="card">
                        <div className="card-header">Register for {this.props.client.name}</div>
                        <div className="card-body">
                          {error && <div className="alert alert-danger">{error.message}</div>}
                          <div className="form-group row">
                            <label
                              className="col-sm-12 col-md-3 col-form-label"
                              htmlFor="emailAddress"
                            >
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
                            <RegistrationForm
                              data={this.state.data}
                              onChange={this.onFormValueChanged}
                            />
                          )}
                          {this.state.step === RegistrationSteps.Multifactor && (
                            <MultiFactorSetup
                              emailAddress={this.state.emailAddress}
                              onVerified={this.onMfaVerified}
                            />
                          )}
                        </div>
                        <div className="card-footer">
                          <div className="btn-toolbar float-right">
                            <button
                              className="btn btn-info"
                              disabled={!this.isValid() || loading}
                              onClick={() => this.onSubmitClick(registerUser)}
                            >
                              {this.state.step === RegistrationSteps.Multifactor ? 'Register' : 'Next'}
                            </button>
                          </div>
                          <div className="clearfix" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
        </Mutation>
      </Primary>
    )
  }
}

export default Register
