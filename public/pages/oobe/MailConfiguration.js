import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import ValidatingInput from '../../components/ValidatingInput'
import React from 'react'
import PropTypes from 'prop-types'

export class MailConfiguration extends React.Component {
  static propTypes = {
    stepIndex: PropTypes.number,
    onValidationChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    data: PropTypes.shape({
      serverAddress: PropTypes.string,
      port: PropTypes.string,
      username: PropTypes.string,
      password: PropTypes.string,
      sslEnabled: PropTypes.bool
    })
  }

  handleChange = (e, validate) => {
    const data = this.props.data
    data[e.target.name] = e.target.value
    this.props.onConfigurationChanged(data)
    if (validate) {
      validate()
    }
  }

  onValidated = (isValid, errors) => {
    this.props.onValidationChanged(this.props.stepIndex, isValid, errors)
  }

  render() {
    const validations = [
      new FormValidationRule('serverAddress', 'isEmpty', false, 'Server Address is required'),
      new FormValidationRule('serverAddress', 'isURL', true, 'Server Address must be a valid URL'),
      new FormValidationRule('port', 'isEmpty', false, 'SMTP Port is required'),
      new FormValidationRule('fromAddress', 'isEmpty', false, 'From Address is required'),
      new FormValidationRule('fromAddress', 'isEmail', true, 'From Address must be a valid email address')
    ]

    return (
      <div>
        <FormValidation validations={validations} data={this.props.data} onValidated={this.onValidated}>
          {({ validate, validationErrors }) => (
            <div>
              <h5>Mail Configuration</h5>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="serverAddress">
                  Mail Server Address
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoFocus
                    autoComplete="off"
                    type="url"
                    name="serverAddress"
                    value={this.props.data.serverAddress}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="port">
                  SMTP Port
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoComplete="off"
                    type="number"
                    name="port"
                    value={this.props.data.port}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="username">
                  Username
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoComplete="new-password"
                    type="number"
                    name="username"
                    placeholder="Optional"
                    value={this.props.data.username}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="password">
                  Password
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoComplete="new-password"
                    type="password"
                    name="password"
                    placeholder="Optional"
                    value={this.props.data.password}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="fromAddress">
                  From Address
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoComplete="off"
                    type="email"
                    name="fromAddress"
                    value={this.props.data.fromAddress}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}