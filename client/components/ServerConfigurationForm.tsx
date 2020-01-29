import React from 'react'
import FormValidation, { FormValidationRule } from './FormValidation'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import { IServerConfiguration } from '../../foundation/models/IServerConfiguration'

export interface IServerConfigurationFormProps {
  data: IServerConfiguration
  onValidated: (isValid: boolean, errors: any) => void
  onConfigurationChanged: (configuration: IServerConfiguration) => void
}

const ServerConfigurationForm = ({ data, onConfigurationChanged, onValidated }: IServerConfigurationFormProps) => {
  const handleChange = (e, validate) => {
    if (e.target.type === 'checkbox') {
      data[e.target.name] = e.target.checked
    } else {
      data[e.target.name] = e.target.value
    }

    onConfigurationChanged(data)
    if (validate) {
      validate()
    }
  }

  const validations = [
    new FormValidationRule('baseUrl', 'isEmpty', false, 'Server Base URL is required'),
    new FormValidationRule('baseUrl', 'isURL', true, 'Server Base URL must be a valid URL'),
    new FormValidationRule('realmName', 'isEmpty', false, 'Realm Name is required')
  ]

  return (
    <div>
      <FormValidation validations={validations} data={data} onValidated={onValidated}>
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
              value={data.baseUrl}
              onChange={(e) => handleChange(e, validate)}
            />

            <ResponsiveValidatingInput
              validationErrors={validationErrors}
              label="Realm Name"
              autoComplete="off"
              type="text"
              name="realmName"
              value={data.realmName}
              onChange={(e) => handleChange(e, validate)}
            />
            <ResponsiveValidatingInput
              validationErrors={validationErrors}
              label="Realm Logo"
              type="photo"
              style={{ height: '100px', border: '1px dashed black' }}
              name="realmLogo"
              value={data.realmLogo}
              onChange={(e) => handleChange(e, validate)}
              helpText="You can drag and drop an image here or click to select one"
            />
            <ResponsiveValidatingInput
              validationErrors={validationErrors}
              label="Realm Background Image"
              type="photo"
              style={{ height: '100px', border: '1px dashed black' }}
              name="realmBackground"
              value={data.realmBackground || '/bg.jpg'}
              onChange={(e) => handleChange(e, validate)}
              helpText="You can drag and drop an image here or click to select one"
            />
          </div>
        )}
      </FormValidation>
    </div>
  )
}

export default ServerConfigurationForm
