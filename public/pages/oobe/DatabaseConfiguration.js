import ValidatingInput from '../../components/ValidatingInput'
import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import FormValidationMessage from '../../components/FormValidationMessage'
import React from 'react'
import PropTypes from 'prop-types'

export class DatabaseConfiguration extends React.Component {
  static propTypes = {
    stepIndex: PropTypes.number,
    onValidationChanged: PropTypes.func.isRequired,
    onConfigurationChanged: PropTypes.func.isRequired,
    data: PropTypes.shape({
      provider: PropTypes.string,
      adminUsername: PropTypes.string,
      adminPassword: PropTypes.string,
      serverAddress: PropTypes.string,
      serverPort: PropTypes.string,
      databaseName: PropTypes.string,
      connectionVerified: PropTypes.bool
    })
  }

  state = {
    blurredInputs: []
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

  onInputBlurred = (e) => {
    const blurredInputs = this.state.blurredInputs
    if (!blurredInputs.includes(e.target.name)) {
      blurredInputs.push(e.target.name)
    }
    this.setState({ blurredInputs })
  }

  render() {
    const validations = [
      new FormValidationRule('provider', 'isEmpty', false, 'Database Provider is required'),
      new FormValidationRule('adminUsername', 'isEmpty', false, 'A database user with admin priveleges is required'),
      new FormValidationRule('adminPassword', 'isEmpty', false, 'A password for the administrative user is required'),
      new FormValidationRule('serverAddress', 'isEmpty', false, 'A database server address is required'),
      new FormValidationRule('serverAddress', 'isURL', true, 'Server address must be a valid URL'),
      new FormValidationRule('serverPort', 'isNumeric', true, 'The database port must be a number'),
      new FormValidationRule('serverPort', 'isEmpty', false, 'A database port must be provided'),
      new FormValidationRule('databaseName', 'isEmpty', false, 'A database name is required'),
      new FormValidationRule('connectionVerified', (val, comp) => val === comp, true, 'You must verify the connection', ['true'])
    ]

    return (
      <div>
        <FormValidation validations={validations} data={this.props.data} onValidated={this.onValidated}>
          {({ validate, validationErrors }) => (
            <div>
              <h5>Database Configuration</h5>
              <div className="form-group row d-none">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="provider">
                  Database Provider
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="provider"
                    autoComplete="off"
                    onBlur={(e) => {}}
                    type="hidden"
                    className={`form-control ${validationErrors['provider'] ? 'is-invalid' : 'is-valid'}`}
                    name="provider"
                    value={this.props.data.provider}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="providerHelpBlock"
                  />
                  <FormValidationMessage id={'providerHelpBlock'} validationErrors={validationErrors['provider']} />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="serverAddress">
                  Server Address
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    autoComplete="off"
                    autoFocus
                    type="url"
                    validationErrors={validationErrors}
                    name="serverAddress"
                    value={this.props.data.serverAddress}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="serverAddressHelpBlock"
                  />

                  <FormValidationMessage id={'serverAddressHelpBlock'} validationErrors={validationErrors['serverAddress']} />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="serverPort">
                  Server Port
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="serverPort"
                    autoComplete="off"
                    type="number"
                    className={`form-control ${validationErrors['serverPort'] ? 'is-invalid' : 'is-valid'}`}
                    name="serverPort"
                    value={this.props.data.serverPort}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="serverPortHelpBlock"
                  />
                  <FormValidationMessage id={'serverPortHelpBlock'} validationErrors={validationErrors['serverPort']} />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="databaseName">
                  Database Name
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="databaseName"
                    autoComplete="off"
                    type="text"
                    required
                    className={`form-control ${validationErrors['databaseName'] ? 'is-invalid' : 'is-valid'}`}
                    name="databaseName"
                    value={this.props.data.databaseName}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="databaseNameHelpBlock"
                  />
                  <FormValidationMessage id={'databaseNameHelpBlock'} validationErrors={validationErrors['databaseName']} />
                </div>
              </div>
              <hr />
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="adminUsername">
                  Admin Username
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="adminUsername"
                    autoComplete="nope"
                    type="text"
                    className={`form-control ${validationErrors['adminUsername'] ? 'is-invalid' : 'is-valid'}`}
                    name="adminUsername"
                    value={this.props.data.adminUsername}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="adminUsernameHelpBlock"
                  />
                  <FormValidationMessage id={'adminUsernameHelpBlock'} validationErrors={validationErrors['adminUsername']} />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="adminPassword">
                  Admin Password
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="adminPassword"
                    autoComplete="new-password"
                    type="password"
                    className={`form-control ${validationErrors['adminPassword'] ? 'is-invalid' : 'is-valid'}`}
                    name="adminPassword"
                    value={this.props.data.adminPassword}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="adminPasswordHelpBlock"
                  />
                  <FormValidationMessage id={'adminPasswordHelpBlock'} validationErrors={validationErrors['adminPassword']} />
                </div>
              </div>
              <hr />
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="btnVerifyConnection">
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      this.handleChange({ target: { name: 'connectionVerified', value: 'true' } }, validate)
                    }}>
                    Click to Verify
                  </button>
                </label>
                <div className="col-sm-12 col-md-9">
                  <input
                    id="connectionVerified"
                    autoComplete="new-password"
                    readOnly
                    type="text"
                    className={`form-control ${validationErrors['connectionVerified'] ? 'is-invalid' : 'is-valid'}`}
                    name="connectionVerified"
                    value={this.props.data.connectionVerified ? 'Verified' : 'Not Verified'}
                    onChange={(e) => this.handleChange(e, validate)}
                    aria-describedby="connectionVerifiedHelpBlock"
                  />
                  <FormValidationMessage id={'connectionVerifiedHelpBlock'} validationErrors={validationErrors['connectionVerified']} />
                </div>
              </div>
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}
