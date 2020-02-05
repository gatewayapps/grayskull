import React from 'react'
import FormValidation, { FormValidationRule } from './FormValidation'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import { ISecurityConfiguration } from '../../foundation/models/ISecurityConfiguration'

export interface ISecurityConfigurationFormProps {
  data: ISecurityConfiguration
  onValidated: (isValid: boolean, errors: any) => void
  onConfigurationChanged: (configuration: ISecurityConfiguration) => void
}

const SecurityConfigurationForm = ({ data, onValidated, onConfigurationChanged }: ISecurityConfigurationFormProps) => {
  const handleChange = (e, validate) => {
    switch (e.target.type) {
      case 'checkbox': {
        data[e.target.name] = e.target.checked
        break
      }
      case 'number': {
        data[e.target.name] = parseInt(e.target.value)
        break
      }
      default: {
        data[e.target.name] = e.target.value
      }
    }

    onConfigurationChanged(data)
    if (validate) {
      validate()
    }
  }

  const validations = [
    new FormValidationRule(
      'passwordMinimumLength',
      'isInt',
      true,
      'Min Password Length is required and must be between 6 and 64',
      [{ gt: 5, lt: 65 }]
    )
  ]

  return (
    <div>
      <FormValidation validations={validations} data={data} onValidated={onValidated}>
        {({ validate, validationErrors }) => (
          <div>
            <h5>Security Configuration</h5>
            <h6 style={{ marginTop: '1rem', marginBottom: '-0.25rem' }}>Password Rules</h6>

            <ResponsiveValidatingInput
              labelColumnWidth={4}
              labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
              validationErrors={validationErrors}
              label="Require lowercase"
              name="passwordRequiresLowercase"
              type="checkbox"
              checked={data.passwordRequiresLowercase}
              onChange={(e) => handleChange(e, validate)}
            />
            <ResponsiveValidatingInput
              labelColumnWidth={4}
              labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
              validationErrors={validationErrors}
              label="Require uppercase"
              name="passwordRequiresUppercase"
              type="checkbox"
              checked={data.passwordRequiresUppercase}
              onChange={(e) => handleChange(e, validate)}
            />
            <ResponsiveValidatingInput
              labelColumnWidth={4}
              labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
              validationErrors={validationErrors}
              label="Require number"
              name="passwordRequiresNumber"
              type="checkbox"
              checked={data.passwordRequiresNumber}
              onChange={(e) => handleChange(e, validate)}
            />
            <ResponsiveValidatingInput
              labelColumnWidth={4}
              labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
              validationErrors={validationErrors}
              label="Require symbol"
              name="passwordRequiresSymbol"
              type="checkbox"
              checked={data.passwordRequiresSymbol}
              onChange={(e) => handleChange(e, validate)}
            />

            <ResponsiveValidatingInput
              validationErrors={validationErrors}
              label="Minimum Length"
              labelColumnWidth={4}
              autoComplete="off"
              min="6"
              max="64"
              type="number"
              name="passwordMinimumLength"
              value={data.passwordMinimumLength}
              onChange={(e) => handleChange(e, validate)}
            />
            <ResponsiveValidatingInput
              validationErrors={validationErrors}
              label="Token Duration (sec)"
              labelColumnWidth={4}
              autoComplete="off"
              min="60"
              type="number"
              name="accessTokenExpirationSeconds"
              value={data.accessTokenExpirationSeconds}
              onChange={(e) => handleChange(e, validate)}
            />

            <ResponsiveValidatingInput
              labelColumnWidth={4}
              validationErrors={validationErrors}
              label="Require Multifactor Authentication"
              name="multifactorRequired"
              type="checkbox"
              checked={data.multifactorRequired}
              onChange={(e) => handleChange(e, validate)}
            />
            <ResponsiveValidatingInput
              labelColumnWidth={4}
              validationErrors={validationErrors}
              label="Allow Registration"
              name="allowSignup"
              type="checkbox"
              checked={data.allowSignup}
              onChange={(e) => handleChange(e, validate)}
            />
            {data.allowSignup && (
              <ResponsiveValidatingInput
                labelColumnWidth={4}
                validationErrors={validationErrors}
                label="Allowed Domains for Sign Up"
                name="domainWhitelist"
                type="text"
                value={data.domainWhitelist}
                onChange={(e) => handleChange(e, validate)}
              />
            )}
          </div>
        )}
      </FormValidation>
    </div>
  )
}
export default SecurityConfigurationForm
