import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import FormValidationMessage from '../../components/FormValidationMessage'
import React from 'react'
import PropTypes from 'prop-types'

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
      new FormValidationRule('baseUrl', 'isURL', true, 'Server Base URL must be a valid URL'),
      new FormValidationRule('realmName', 'isEmpty', false, 'Realm Name is required')
    ]

    return (
      <div>
        <FormValidation validations={validations} data={this.props.data} onValidated={this.onValidated}>
          {({ validate, validationErrors }) => (
            <div>
              <h5>Server Configuration</h5>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="baseUrl">
                  Server Base URL
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="baseUrl"
                    autoFocus
                    autoComplete="off"
                    type="url"
                    className={`form-control ${validationErrors['baseUrl'] ? 'is-invalid' : 'is-valid'}`}
                    name="baseUrl"
                    value={this.props.data.baseUrl}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="baseUrlHelpBlock"
                  />
                  <FormValidationMessage id={'baseUrlHelpBlock'} validationErrors={validationErrors['baseUrl']} />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="realmName">
                  Realm Name
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="realmName"
                    autoFocus
                    autoComplete="off"
                    type="text"
                    className={`form-control ${validationErrors['realmName'] ? 'is-invalid' : 'is-valid'}`}
                    name="realmName"
                    value={this.props.data.realmName}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="realmNameHelpBlock"
                  />
                  <FormValidationMessage id={'realmNameHelpBlock'} validationErrors={validationErrors['realmName']} />
                </div>
              </div>
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}