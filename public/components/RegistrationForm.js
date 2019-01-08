import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { validatePassword } from '../utils/passwordComplexity'
import PasswordComplexity from './PasswordComplexity'

class RegistrationForm extends PureComponent {
  handleChange = (e) => {
    this.props.onChange(e.target.name, e.target.value)
  }

  render() {
    return (
      <div>
        <h5>User Profile</h5>
        <div className="form-group row mt-5">
          <label
            className="col-sm-12 col-md-3 col-form-label"
            htmlFor="firstName"
          >
            First Name
          </label>
          <div className="col-sm-12 col-md-9">
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={this.props.data.firstName}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label
            className="col-sm-12 col-md-3 col-form-label"
            htmlFor="lastName"
          >
            Last Name
          </label>
          <div className="col-sm-12 col-md-9">
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={this.props.data.lastName}
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="form-group row mt-5">
          <label
            className="col-sm-12 col-md-3 col-form-label"
            htmlFor="password"
          >
            Password
          </label>
          <div className="col-sm-12 col-md-9">
            <input
              type="password"
              className="form-control"
              name="password"
              aria-describedby='passwordHelpBlock'
              value={this.props.data.password}
              onChange={this.handleChange}
            />
            {!validatePassword(this.props.data.password, this.props.configuration) && (
              <div id='passwordHelpBlock' className='alert alert-info mt-2 mb-0'>
                <div className='alert-heading'>Password requirements</div>
                <PasswordComplexity
                  configuration={this.props.configuration}
                  password={this.props.data.password}
                />
              </div>
            )}
          </div>
        </div>
        <div className="form-group row">
          <label
            className="col-sm-12 col-md-3 col-form-label"
            htmlFor="confirm"
          >
            Confirm
          </label>
          <div className="col-sm-12 col-md-9">
            <input
              type="password"
              className="form-control"
              name="confirm"
              aria-describedby='confirmHelpBlock'
              value={this.props.data.confirm}
              onChange={this.handleChange}
            />
            {this.props.data.confirm !== this.props.data.password && (
              <small id='confirmHelpBlock' className='form-text text-danger'>
                Confirm value must match password
              </small>
            )}
          </div>
        </div>
      </div>
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
}

export default RegistrationForm
