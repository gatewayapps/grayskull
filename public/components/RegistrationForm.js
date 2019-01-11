import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { validatePassword } from '../utils/passwordComplexity'
import PasswordComplexity from './PasswordComplexity'
import FormValidation, { FormValidationRule } from './FormValidation'
import { ApolloConsumer } from 'react-apollo';

const GET_EMAIL_ADDRESS_QUERY = gql`
  query GET_EMAIL_ADDRESS_QUERY($emailAddress: String!) {
    emailAddress(where: { emailAddress: $emailAddress }) {
      emailAddressId
    }
  }
`

class RegistrationForm extends PureComponent {
  handleChange = (e, validate) => {
    this.props.onChange(e.target.name, e.target.value)
    if (validate) {
      validate()
    }
  }

  render() {
    return (
      <ApolloConsumer>
        {(apolloClient) => {
          const checkEmailAvailable = async (val, client) => {
            if (!val) {
              return true
            }
            const { data } = await client.query({
              query: GET_EMAIL_ADDRESS_QUERY,
              variables: { emailAddress: val },
              refetchPolicy: 'network-only'
            })
            return data && !data.emailAddress
          }

          const validations = [
            new FormValidationRule('emailAddress', 'isEmpty', false, 'E-mail address is required'),
            new FormValidationRule('emailAddress', 'isEmail', true, 'Not a valid email address'),
            new FormValidationRule('emailAddress', checkEmailAvailable, true, 'Sorry, this email address is already being used by another account', [apolloClient]),
            new FormValidationRule('firstName', 'isEmpty', false, 'First name is required'),
            new FormValidationRule('lastName', 'isEmpty', false, 'Last name is required'),
            new FormValidationRule('password', validatePassword, true, 'Password does not meet complexity requirements', [this.props.configuration]),
            new FormValidationRule('confirm', 'isEmpty', false, 'Confirm password is required'),
            new FormValidationRule('confirm', 'equals', true, 'Confirm should match the password', [this.props.data.password])
          ]

          return (
            <FormValidation validations={validations} data={this.props.data} onValidated={this.props.onValidated}>
              {({ isValid, validate, validationErrors }) => (
                <div>
                  <h5>User Profile</h5>
                  <div className='form-group row'>
                    <label className='col-sm-12 col-md-3 col-form-label' htmlFor='emailAddress'>
                      E-mail Address
                    </label>
                    <div className='col-sm-12 col-md-9'>
                      <input
                        id='emailAddress'
                        autoComplete='username'
                        autoFocus
                        type='email'
                        className={`form-control ${validationErrors['emailAddress'] ? 'is-invalid' : 'is-valid'}`}
                        name='emailAddress'
                        value={this.props.data.emailAddress}
                        onChange={(e) => this.handleChange(e, validate)}
                        aria-describedby='emailAddressHelpBlock'
                      />
                      {validationErrors['emailAddress'] && (
                        <small id='emailAddressHelpBlock' className='form-text text-danger'>
                          {validationErrors['emailAddress'].map((msg, idx) => (<div key={idx}>{msg}</div>))}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className='form-group row mt-5'>
                    <label
                      className='col-sm-12 col-md-3 col-form-label'
                      htmlFor='firstName'
                    >
                      First Name
                    </label>
                    <div className='col-sm-12 col-md-9'>
                      <input
                        id='firstName'
                        type='text'
                        className={`form-control ${validationErrors['firstName'] ? 'is-invalid' : 'is-valid'}`}
                        name='firstName'
                        value={this.props.data.firstName}
                        onChange={(e) => this.handleChange(e, validate)}
                        aria-describedby='firstNameHelpBlock'
                      />
                      {validationErrors['firstName'] && (
                        <small id='firstNameHelpBlock' className='form-text text-danger'>
                          {validationErrors['firstName'].map((msg, idx) => (<div key={idx}>{msg}</div>))}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label
                      className='col-sm-12 col-md-3 col-form-label'
                      htmlFor='lastName'
                    >
                      Last Name
                    </label>
                    <div className='col-sm-12 col-md-9'>
                      <input
                        id='lastName'
                        type='text'
                        className={`form-control ${validationErrors['lastName'] ? 'is-invalid' : 'is-valid'}`}
                        name='lastName'
                        value={this.props.data.lastName}
                        onChange={(e) => this.handleChange(e, validate)}
                        aria-describedby='lastNameHelpBlock'
                      />
                      {validationErrors['lastName'] && (
                        <small id='lastNameHelpBlock' className='form-text text-danger'>
                          {validationErrors['lastName'].map((msg, idx) => (<div key={idx}>{msg}</div>))}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className='form-group row mt-5'>
                    <label
                      className='col-sm-12 col-md-3 col-form-label'
                      htmlFor='password'
                    >
                      Password
                    </label>
                    <div className='col-sm-12 col-md-9'>
                      <input
                        id='password'
                        autoComplete='new-password'
                        type='password'
                        className={`form-control ${validationErrors['password'] ? 'is-invalid' : 'is-valid'}`}
                        name='password'
                        aria-describedby='passwordHelpBlock'
                        value={this.props.data.password}
                        onChange={(e) => this.handleChange(e, validate)}
                      />
                      {validationErrors['password'] && (
                        <div id='passwordHelpBlock' className='card border-info mt-2'>
                          <div className='card-header'>Password requirements</div>
                          <div className='card-body'>
                            <PasswordComplexity
                              configuration={this.props.configuration}
                              password={this.props.data.password}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='form-group row'>
                    <label
                      className='col-sm-12 col-md-3 col-form-label'
                      htmlFor='confirm'
                    >
                      Confirm
                    </label>
                    <div className='col-sm-12 col-md-9'>
                      <input
                        id='confirm'
                        type='password'
                        autoComplete='new-password'
                        className={`form-control ${validationErrors['confirm'] ? 'is-invalid' : 'is-valid'}`}
                        name='confirm'
                        aria-describedby='confirmHelpBlock'
                        value={this.props.data.confirm}
                        onChange={(e) => this.handleChange(e, validate)}
                      />
                      {validationErrors['confirm'] && (
                        <small id='confirmHelpBlock' className='form-text text-danger'>
                          {validationErrors['confirm'].map((msg, idx) => (<div key={idx}>{msg}</div>))}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </FormValidation>
          )
        }}
      </ApolloConsumer>
    )
  }
}

RegistrationForm.propTypes = {
  configuration: PropTypes.shape({
    passwordMinimumLength: PropTypes.number.isRequired,
    passwordRequireNumber: PropTypes.bool.isRequired,
    passwordRequireSymbol: PropTypes.bool.isRequired,
    passwordRequireLowercase: PropTypes.bool.isRequired,
    passwordRequireUppercase: PropTypes.bool.isRequired,
  }).isRequired,
  data: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirm: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onValidated: PropTypes.func,
}

export default RegistrationForm
