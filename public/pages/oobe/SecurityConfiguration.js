import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import { Button, ButtonGroup } from 'reactstrap'
import ValidatingInput from '../../components/ValidatingInput'
import React from 'react'
import PropTypes from 'prop-types'

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
              <div className="form-group row">
                <label className="col-sm-12 col-md-4 col-form-label" htmlFor="baseUrl">
                  Password Complexity
                </label>
                <div className="col-sm-12 col-md-8">
                  <ButtonGroup style={{ display: 'flex' }}>
                    <Button
                      style={{ textTransform: 'lowercase', flex: 1 }}
                      color="primary"
                      outline={!this.props.data.passwordRequiresLowercase}
                      active={this.props.data.passwordRequiresLowercase}
                      onClick={() => {
                        this.handleChange({ target: { name: 'passwordRequiresLowercase', value: !this.props.data.passwordRequiresLowercase } })
                      }}>
                      a-z
                    </Button>
                    <Button
                      style={{ textTransform: 'uppercase', flex: 1 }}
                      color="primary"
                      outline={!this.props.data.passwordRequiresUppercase}
                      active={this.props.data.passwordRequiresUppercase}
                      onClick={() => {
                        this.handleChange({ target: { name: 'passwordRequiresUppercase', value: !this.props.data.passwordRequiresUppercase } })
                      }}>
                      A-Z
                    </Button>
                    <Button
                      style={{ textTransform: 'uppercase', flex: 1 }}
                      color="primary"
                      outline={!this.props.data.passwordRequiresNumber}
                      active={this.props.data.passwordRequiresNumber}
                      onClick={() => {
                        this.handleChange({ target: { name: 'passwordRequiresNumber', value: !this.props.data.passwordRequiresNumber } })
                      }}>
                      0-9
                    </Button>
                    <Button
                      style={{ textTransform: 'uppercase', flex: 1 }}
                      color="primary"
                      outline={!this.props.data.passwordRequiresSymbol}
                      active={this.props.data.passwordRequiresSymbol}
                      onClick={() => {
                        this.handleChange({ target: { name: 'passwordRequiresSymbol', value: !this.props.data.passwordRequiresSymbol } })
                      }}>
                      !,@,#,...
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-4 col-form-label" htmlFor="multifactorRequired">
                  Min Password Length
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
              <div className="form-group row">
                <label className="col-sm-12 col-md-4 col-form-label" htmlFor="multifactorRequired">
                  Multifactor Authentication
                </label>
                <div className="col-sm-12 col-md-8">
                  <Button
                    style={{ textTransform: 'uppercase', width: '100%' }}
                    color="primary"
                    outline={!this.props.data.multifactorRequired}
                    active={this.props.data.multifactorRequired}
                    onClick={() => {
                      this.handleChange({ target: { name: 'multifactorRequired', value: !this.props.data.multifactorRequired } })
                    }}>
                    {this.props.data.multifactorRequired ? 'Required' : 'Not Required'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}
