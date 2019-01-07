import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

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
              value={this.props.data.password}
              onChange={this.handleChange}
            />
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
              value={this.props.data.confirm}
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>
    )
  }
}

RegistrationForm.propTypes = {
  data: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirm: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default RegistrationForm
