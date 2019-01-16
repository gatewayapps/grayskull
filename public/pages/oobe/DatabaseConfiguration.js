import ValidatingInput from '../../components/ValidatingInput'
import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import FormValidationMessage from '../../components/FormValidationMessage'
import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'

const VERIFY_DATABASE_CONNECTION = gql`
  mutation VERIFY_DATABASE_CONNECTION($provider: String!, $serverAddress: String!, $serverPort: String!, $databaseName: String!, $adminUsername: String!, $adminPassword: String!) {
    verifyDatabaseConnection(
      data: {
        provider: $provider
        serverAddress: $serverAddress
        serverPort: $serverPort
        databaseName: $databaseName
        adminUsername: $adminUsername
        adminPassword: $adminPassword
      }
    ) {
      success
      error
      message
    }
  }
`

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

    if (['verifyingConnection', 'connectionVerified', 'connectionError'].includes(e.target.name) === false) {
      data.connectionVerified = false
    }

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
      new FormValidationRule('connectionVerified', (val, comp) => val === comp, true, 'You must verify the connection', [true])
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
                  <ValidatingInput
                    autoComplete="off"
                    type="hidden"
                    validationErrors={validationErrors}
                    name="provider"
                    value={this.props.data.provider}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
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
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="serverPort">
                  Server Port
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    autoComplete="off"
                    type="number"
                    name="serverPort"
                    validationErrors={validationErrors}
                    value={this.props.data.serverPort}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="databaseName">
                  Database Name
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    autoComplete="off"
                    type="text"
                    required
                    validationErrors={validationErrors}
                    name="databaseName"
                    value={this.props.data.databaseName}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <hr />
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="adminUsername">
                  Admin Username
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoComplete="nope"
                    type="text"
                    name="adminUsername"
                    value={this.props.data.adminUsername}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-3 col-form-label" htmlFor="adminPassword">
                  Admin Password
                </label>
                <div className="col-sm-12 col-md-9">
                  <ValidatingInput
                    validationErrors={validationErrors}
                    autoComplete="new-password"
                    type="password"
                    name="adminPassword"
                    value={this.props.data.adminPassword}
                    onChange={(e) => this.handleChange(e, validate)}
                  />
                </div>
              </div>
              <hr />
              <ApolloConsumer>
                {(apolloClient) => (
                  <div className="form-group row">
                    <div className="col-sm-12 col-md-3">
                      <button
                        className="btn btn-sm btn-success"
                        disabled={this.props.data.verifyingConnection}
                        onClick={async () => {
                          this.handleChange({ target: { name: 'verifyingConnection', value: true } }, validate)
                          const { data } = await apolloClient.mutate({ mutation: VERIFY_DATABASE_CONNECTION, variables: { ...this.props.data } })
                          const success = data.verifyDatabaseConnection.success
                          this.handleChange({ target: { name: 'verifyingConnection', value: false } }, validate)
                          this.handleChange({ target: { name: 'connectionVerified', value: success } }, validate)
                          this.handleChange({ target: { name: 'connectionError', value: data.verifyDatabaseConnection.error } })
                        }}>
                        {this.props.data.verifyingConnection ? (
                          <span>
                            <i className="fa fa-fw fa-spin fa-spinner" /> Verifying
                          </span>
                        ) : (
                          'Verify Connection'
                        )}
                      </button>
                    </div>
                    <div className="col-sm-12 col-md-9">
                      <input
                        id="connectionVerified"
                        autoComplete="new-password"
                        readOnly
                        type="text"
                        className={`form-control ${validationErrors['connectionVerified'] ? 'is-invalid' : 'is-valid'}`}
                        name="connectionVerified"
                        value={this.props.data.connectionVerified ? 'Verified' : this.props.data.connectionError || 'Not Verified'}
                        onChange={(e) => this.handleChange(e, validate)}
                        aria-describedby="connectionVerifiedHelpBlock"
                      />
                      <FormValidationMessage id={'connectionVerifiedHelpBlock'} validationErrors={validationErrors['connectionVerified']} />
                    </div>
                  </div>
                )}
              </ApolloConsumer>
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}
