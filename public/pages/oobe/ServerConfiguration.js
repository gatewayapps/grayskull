import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import ValidatingInput from '../../components/ValidatingInput'
import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveValidatingInput from '../../components/ResponsiveValidatingInput'

export class ServerConfiguration extends React.Component {
  static propTypes = {
    stepIndex: PropTypes.number,
    onValidationChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    data: PropTypes.shape({
      realmName: PropTypes.string,
      baseUrl: PropTypes.string
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
      new FormValidationRule('baseUrl', 'isEmpty', false, 'Server Base URL is required'),
      new FormValidationRule('baseUrl', 'startsWith', true, 'Server Base URL must start with https', ['https']),
      new FormValidationRule('baseUrl', 'isURL', true, 'Server Base URL must be a valid URL'),
      new FormValidationRule('realmName', 'isEmpty', false, 'Realm Name is required'),
      new FormValidationRule('privateKey', 'isEmpty', false, 'You must provide a private key'),
      new FormValidationRule('certificate', 'isEmpty', false, 'You must provide a certificate')
    ]

    return (
      <div>
        <FormValidation validations={validations} data={this.props.data} onValidated={this.onValidated}>
          {({ validate, validationErrors }) => (
            <div>
              <h5>Server Configuration</h5>
              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                autoFocus
                label="Server Base URL"
                autoComplete="off"
                type="url"
                name="baseUrl"
                value={this.props.data.baseUrl}
                onChange={(e) => this.handleChange(e, validate)}
              />

              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                label="Realm Name"
                autoComplete="off"
                type="text"
                name="realmName"
                value={this.props.data.realmName}
                onChange={(e) => this.handleChange(e, validate)}
              />
              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                label="Private Key"
                spellCheck={false}
                autoComplete="off"
                rows={5}
                type="textarea"
                name="privateKey"
                value={this.props.data.privateKey}
                onChange={(e) => this.handleChange(e, validate)}
              />
              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                label="Certificate"
                autoComplete="off"
                rows={5}
                spellCheck={false}
                type="textarea"
                name="certificate"
                value={this.props.data.certificate}
                onChange={(e) => this.handleChange(e, validate)}
              />
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}
