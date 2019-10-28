import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import ResponsiveValidatingInput from '../../components/ResponsiveValidatingInput'

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
      tlsSslRequired: PropTypes.bool
    })
  }
  handleChange = (e, validate) => {
    const data = this.props.data
    if (e.target.type === 'checkbox') {
      data[e.target.name] = e.target.checked
    } else {
      data[e.target.name] = e.target.value
    }

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

              <ResponsiveValidatingInput
                label="Server Address"
                validationErrors={validationErrors}
                autoFocus
                autoComplete="off"
                type="url"
                name="serverAddress"
                value={this.props.data.serverAddress}
                onChange={(e) => this.handleChange(e, validate)}
              />

              <ResponsiveValidatingInput
                label="Server Port"
                validationErrors={validationErrors}
                autoComplete="off"
                type="number"
                name="port"
                value={this.props.data.port}
                onChange={(e) => this.handleChange(e, validate)}
              />

              <ResponsiveValidatingInput
                label="TLS/SSL Enabled"
                validationErrors={validationErrors}
                type="checkbox"
                name="tlsSslRequired"
                placeholder="Optional"
                value={this.props.data.tlsSslRequired}
                onChange={(e) => this.handleChange(e, validate)}
              />

              <ResponsiveValidatingInput
                label="Username"
                validationErrors={validationErrors}
                autoComplete="new-password"
                type="text"
                name="username"
                placeholder="Optional"
                value={this.props.data.username}
                onChange={(e) => this.handleChange(e, validate)}
              />

              <ResponsiveValidatingInput
                label="Password"
                validationErrors={validationErrors}
                autoComplete="new-password"
                type="password"
                name="password"
                placeholder="Optional"
                value={this.props.data.password}
                onChange={(e) => this.handleChange(e, validate)}
              />
              <ResponsiveValidatingInput
                label="From Address"
                validationErrors={validationErrors}
                autoComplete="off"
                type="email"
                name="fromAddress"
                value={this.props.data.fromAddress}
                onChange={(e) => this.handleChange(e, validate)}
              />
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}

export default MailConfiguration
