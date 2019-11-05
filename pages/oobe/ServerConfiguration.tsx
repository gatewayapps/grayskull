import { default as FormValidation, FormValidationRule } from '../../client/components/FormValidation'

import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveValidatingInput from '../../client/components/ResponsiveValidatingInput'
import StateButton from '../../client/components/StateButton'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'

const VERIFY_CERTBOT = gql`
  mutation VERIFY_CERTBOT($domain: String!) {
    verifyCertbot(domain: $domain) {
      success
      error
      message
    }
  }
`

const CERTBOT_STATES = {
  VALIDATED: 'VALIDATED',
  NOT_VALIDATED: 'NOT_VALIDATED',
  FAILED_VALIDATION: 'FAILED_VALIDATION',
  VALIDATING: 'VALIDATING'
}

export class ServerConfiguration extends React.Component {
  static propTypes = {
    stepIndex: PropTypes.number,
    onValidationChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    data: PropTypes.shape({
      realmName: PropTypes.string,
      realmLogo: PropTypes.string,
      baseUrl: PropTypes.string
    })
  }

  handleChange = (e, validate) => {
    const data = this.props.data
    if (e.target.type === 'checkbox') {
      data[e.target.name] = e.target.checked
    } else {
      data[e.target.name] = e.target.value
    }

    if (e.target.name === 'baseUrl') {
      data['certBotState'] = CERTBOT_STATES.NOT_VALIDATED
    }

    this.props.onConfigurationChanged(data)
    if (validate) {
      validate()
    }
  }

  onValidated = (isValid, errors) => {
    this.props.onValidationChanged(this.props.stepIndex, isValid, errors)
  }

  setCertBotState = (state, validate) => {
    this.handleChange({ target: { name: 'certBotState', value: state } }, validate)
  }

  render() {
    const validateFormStatus = (fieldName, enableCertbot, certBotState, privateKey, certificate, forceHttpsRedirect) => {
      if (!forceHttpsRedirect) {
        return true
      }

      if (enableCertbot) {
        return certBotState === CERTBOT_STATES.VALIDATED
      }
      return privateKey !== '' && certificate !== ''
    }

    const validations = [
      new FormValidationRule('baseUrl', 'isEmpty', false, 'Server Base URL is required'),
      new FormValidationRule('baseUrl', 'isURL', true, 'Server Base URL must be a valid URL'),
      new FormValidationRule('realmName', 'isEmpty', false, 'Realm Name is required')
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
                label="Realm Logo"
                type="photo"
                style={{ height: '100px', border: '1px dashed black' }}
                name="realmLogo"
                value={this.props.data.realmLogo}
                onChange={(e) => this.handleChange(e, validate)}
                helpText="You can drag and drop an image here or click to select one"
              />
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}
export default ServerConfiguration
