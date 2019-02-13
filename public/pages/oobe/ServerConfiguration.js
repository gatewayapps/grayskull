import { default as FormValidation, FormValidationRule } from '../../components/FormValidation'
import ValidatingInput from '../../components/ValidatingInput'
import React from 'react'
import PropTypes from 'prop-types'
import ResponsiveValidatingInput from '../../components/ResponsiveValidatingInput'
import StateButton from '../../components/StateButton'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'
import ImageDropArea from '../../components/ImageDropArea'

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
      baseUrl: PropTypes.string,
      enableCertbot: PropTypes.bool,
      certBotState: PropTypes.string,
      privateKey: PropTypes.string,
      certificate: PropTypes.string,
      forceHttpsRedirect: PropTypes.bool
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
    console.log('in onvalidated', isValid, errors)
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
      new FormValidationRule('realmName', 'isEmpty', false, 'Realm Name is required'),
      new FormValidationRule('privateKey', validateFormStatus, true, 'You must validate certbot OR provide a private key and certificate', [
        this.props.data.enableCertbot,
        this.props.data.certBotState,
        this.props.data.privateKey,
        this.props.data.certificate,
        this.props.data.forceHttpsRedirect
      ]),
      new FormValidationRule('certificate', validateFormStatus, true, 'You must validate certbot OR provide a private key and certificate', [
        this.props.data.enableCertbot,
        this.props.data.certBotState,
        this.props.data.privateKey,
        this.props.data.certificate,
        this.props.data.forceHttpsRedirect
      ]),
      new FormValidationRule('certBotState', validateFormStatus, true, 'You must validate certbot OR provide a private key and certificate', [
        this.props.data.enableCertbot,
        this.props.data.certBotState,
        this.props.data.privateKey,
        this.props.data.certificate,
        this.props.data.forceHttpsRedirect
      ])
      // new FormValidationRule('privateKey', 'isEmpty', false, 'You must provide a private key'),
      // new FormValidationRule('certificate', 'isEmpty', false, 'You must provide a certificate')
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
              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                label="Force HTTPS"
                autoComplete="off"
                helpText={`Redirect HTTP traffice to HTTPS`}
                type="checkbox"
                name="forceHttpsRedirect"
                checked={this.props.data.forceHttpsRedirect}
                onChange={(e) => this.handleChange(e, validate)}
              />
              <ResponsiveValidatingInput
                validationErrors={validationErrors}
                label="Use Let'sEncrypt.org"
                autoComplete="off"
                helpText={`Automatically attempt to get a signed HTTPS certificate from Let's Encrypt using Greenlock`}
                type="checkbox"
                name="enableCertbot"
                checked={this.props.data.enableCertbot}
                onChange={(e) => this.handleChange(e, validate)}
              />
              {this.props.data.enableCertbot && (
                <ApolloConsumer>
                  {(apolloClient) => (
                    <div className="form-group row">
                      <div className="col-sm-12 col-md-9 offset-md-3">
                        <StateButton
                          states={{
                            [CERTBOT_STATES.VALIDATED]: {
                              className: 'btn-success',
                              render: (props) => (
                                <span>
                                  <i className="fa fa-fw fa-check" /> Validated
                                </span>
                              )
                            },
                            [CERTBOT_STATES.NOT_VALIDATED]: {
                              className: 'btn-outline-warning',
                              render: (props) => (
                                <span>
                                  <i className="fa fa-fw fa-info-circle" /> Validate LetsEncrypt
                                </span>
                              )
                            },
                            [CERTBOT_STATES.VALIDATING]: {
                              className: 'btn-outline-primary',
                              render: (props) => (
                                <span>
                                  <i className="fa fa-fw fa-spin fa-spinner" /> Validating
                                </span>
                              )
                            },
                            [CERTBOT_STATES.FAILED_VALIDATION]: {
                              className: 'btn-danger',
                              render: (props) => (
                                <span>
                                  <i className="fa fa-fw fa-exclamation-circle" /> Validation Failed
                                </span>
                              )
                            }
                          }}
                          className="btn"
                          disabled={[CERTBOT_STATES.VALIDATED, CERTBOT_STATES.VALIDATING].includes(this.props.data.certBotState)}
                          state={this.props.data.certBotState}
                          onClick={async () => {
                            this.setCertBotState(CERTBOT_STATES.VALIDATING, validate)
                            const { data } = await apolloClient.mutate({ mutation: VERIFY_CERTBOT, variables: { domain: this.props.data.baseUrl } })
                            const success = data.verifyCertbot.success
                            if (success) {
                              this.setCertBotState(CERTBOT_STATES.VALIDATED, validate)
                            } else {
                              this.setCertBotState(CERTBOT_STATES.FAILED_VALIDATION, validate)
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                </ApolloConsumer>
              )}

              {!this.props.data.enableCertbot && (
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
              )}
              {!this.props.data.enableCertbot && (
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
              )}
            </div>
          )}
        </FormValidation>
      </div>
    )
  }
}
