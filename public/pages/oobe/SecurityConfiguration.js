import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import { Button, ButtonGroup } from 'reactstrap'
import ValidatingInput from '../../components/ValidatingInput'
import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveValidatingInput from '../../components/ResponsiveValidatingInput'

export class SecurityConfiguration extends React.Component {
  static propTypes = {
    stepIndex: PropTypes.number,
    onValidationChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    data: PropTypes.shape({
      maxLoginsAttemptsPerMinute: PropTypes.number,
      passwordsExpire: PropTypes.bool,
      maxPasswordAge: PropTypes.number,
      passwordRequiresLowercase: PropTypes.bool,
      passwordRequiresUppercase: PropTypes.bool,
      passwordRequiresNumber: PropTypes.bool,
      passwordRequiresSymbol: PropTypes.bool,
      passwordMinimumLength: PropTypes.string,
      multifactorRequired: PropTypes.bool,
      accessTokenExpirationSeconds: PropTypes.number
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
      new FormValidationRule('passwordMinimumLength', 'isEmpty', false, 'Min Password Length is required')
      // new FormValidationRule('baseUrl', 'isURL', true, 'Server Base URL must be a valid URL'),
      // new FormValidationRule('realmName', 'isEmpty', false, 'Realm Name is required')
    ]

    return (
      <div>
        <FormValidation validations={validations} data={this.props.data} onValidated={this.onValidated}>
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
                checked={this.props.data.passwordRequiresLowercase}
                onChange={(e) => this.handleChange(e, validate)}
              />
              <ResponsiveValidatingInput
                labelColumnWidth={4}
                labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                validationErrors={validationErrors}
                label="Require uppercase"
                name="passwordRequiresUppercase"
                type="checkbox"
                checked={this.props.data.passwordRequiresUppercase}
                onChange={(e) => this.handleChange(e, validate)}
              />
              <ResponsiveValidatingInput
                labelColumnWidth={4}
                labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                validationErrors={validationErrors}
                label="Require number"
                name="passwordRequiresNumber"
                type="checkbox"
                checked={this.props.data.passwordRequiresNumber}
                onChange={(e) => this.handleChange(e, validate)}
              />
              <ResponsiveValidatingInput
                labelColumnWidth={4}
                labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
                validationErrors={validationErrors}
                label="Require symbol"
                name="passwordRequiresSymbol"
                type="checkbox"
                checked={this.props.data.passwordRequiresSymbol}
                onChange={(e) => this.handleChange(e, validate)}
              />

              <div className="form-group row">
                <label className="col-sm-12 col-md-4 col-form-label" htmlFor="passwordMinimumLength">
                  Minimum Length
                </label>
                <div className="col-sm-12 col-md-8">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoComplete="off"
                    min="6"
                    type="number"
                    name="passwordMinimumLength"
                    value={this.props.data.passwordMinimumLength}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <ResponsiveValidatingInput
                labelColumnWidth={4}
                validationErrors={validationErrors}
                label="Require Multifactor Authentication"
                name="multifactorRequired"
                type="checkbox"
                checked={this.props.data.multifactorRequired}
                onChange={(e) => this.handleChange(e, validate)}
              />
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}
