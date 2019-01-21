import React from 'react'
import Primary from '../../layouts/primary'
import { GettingStarted } from './GettingStarted'
import { ServerConfiguration } from './ServerConfiguration'
import { DatabaseConfiguration } from './DatabaseConfiguration'
import { MailConfiguration } from './MailConfiguration'
import { SecurityConfiguration } from './SecurityConfiguration'
import { ConfirmConfiguration } from './ConfirmConfiguration'
import { Modal, ModalBody } from 'reactstrap'

import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'

const SAVE_CONFIGURATION = gql`
  mutation SAVE_CONFIGURATION($configuration: SaveConfigurationArgs!) {
    saveConfiguration(data: $configuration) {
      success
      error
      message
    }
  }
`

export default class OobeIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      saving: false,
      currentStep: 0,
      steps: [
        {
          valid: false
        },
        {
          valid: false
        },
        {
          valid: false
        },
        {
          valid: false
        },
        {
          valid: false
        },
        {
          valid: false
        }
      ],
      configuration: {
        Server: {
          realmName: 'Grayskull',
          baseUrl: 'http://127.0.0.1'
        },
        Database: {
          provider: 'postgres',
          adminUsername: 'root',
          adminPassword: 'pass',
          serverAddress: '127.0.0.1',
          serverPort: '5432',
          databaseName: 'grayskull',
          connectionVerified: false
        },
        Mail: {
          serverAddress: '127.0.0.1',
          port: '25',
          username: '',
          password: '',
          fromAddress: 'admin@grayskull.io'
        },
        Security: {
          passwordRequiresLowercase: false,
          passwordRequiresUppercase: false,
          passwordRequiresNumber: false,
          passwordRequiresSymbol: false,
          passwordMinimumLength: '8',
          multifactorRequired: false,
          accessTokenExpirationSeconds: 1800
        }
      }
    }
  }

  renderCardBody() {
    switch (this.state.currentStep) {
      case 0: {
        return <GettingStarted stepIndex={0} onValidationChanged={this.onValidationChanged} />
      }
      case 1: {
        return (
          <ServerConfiguration
            stepIndex={1}
            onConfigurationChanged={(data) => {
              const config = this.state.configuration
              config.Server = data
              this.setState({ configuration: config })
            }}
            data={this.state.configuration.Server}
            onValidationChanged={this.onValidationChanged}
          />
        )
      }
      case 2: {
        return (
          <DatabaseConfiguration
            stepIndex={2}
            onConfigurationChanged={(data) => {
              const config = this.state.configuration
              config.Database = data
              this.setState({ configuration: config })
            }}
            data={this.state.configuration.Database}
            onValidationChanged={this.onValidationChanged}
          />
        )
      }
      case 3: {
        return (
          <MailConfiguration
            stepIndex={3}
            onConfigurationChanged={(data) => {
              const config = this.state.configuration
              config.Mail = data
              this.setState({ configuration: config })
            }}
            data={this.state.configuration.Mail}
            onValidationChanged={this.onValidationChanged}
          />
        )
      }
      case 4: {
        return (
          <SecurityConfiguration
            stepIndex={4}
            onConfigurationChanged={(data) => {
              const config = this.state.configuration
              config.Security = data
              this.setState({ configuration: config })
            }}
            data={this.state.configuration.Security}
            onValidationChanged={this.onValidationChanged}
          />
        )
      }
      case 5: {
        return <ConfirmConfiguration stepIndex={5} configuration={this.state.configuration} onValidationChanged={this.onValidationChanged} />
      }
    }
  }

  onValidationChanged = (stepIndex, isValid, errors) => {
    const steps = this.state.steps
    steps[stepIndex].valid = isValid

    this.setState({
      steps
    })
  }

  waitForRedirect = async () => {
    let secondsTicked = 0
    const redirectInterval = window.setInterval(() => {
      secondsTicked++
      this.setState({ secondsRemaining: 45 - secondsTicked })
      if (secondsTicked >= 45) {
        window.clearInterval(redirectInterval)
        window.location = `${this.state.configuration.Server.baseUrl}`
      }
    }, 1000)
  }

  render() {
    return (
      <Primary>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: 'url(/static/bg.jpg)' }}>
          <div className="container d-flex h-100" style={{ overflow: 'auto' }}>
            <div className="justify-content-center align-self-center w-100" style={{ maxHeight: '100%' }}>
              <h4 className="display-4 text-center w-100 mb-5" style={{ fontSize: '4vmin' }}>
                Welcome to your Grayskull Authentication Server
              </h4>
              <div className="row justify-content-center ">
                <div className="col-sm-12 col-md-8 col-push-2">
                  <ApolloConsumer>
                    {(apolloClient) => (
                      <form
                        autoComplete="nope"
                        onSubmit={(e) => {
                          e.preventDefault()
                        }}>
                        <input autoComplete="false" name="hidden" type="text" className="d-none" />
                        <div className="card">
                          <div className="card-body">{this.renderCardBody()}</div>
                          <div className="card-footer">
                            <div className="btn-toolbar float-right">
                              {this.state.currentStep > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    this.setState({ currentStep: this.state.currentStep - 1 })
                                  }}
                                  className="btn btn-outline-default mr-2">
                                  Back
                                </button>
                              )}
                              {this.state.currentStep < this.state.steps.length - 1 && (
                                <button
                                  type="submit"
                                  onClick={() => {
                                    this.setState({ currentStep: this.state.currentStep + 1 })
                                  }}
                                  className="btn btn-outline-success"
                                  disabled={!this.state.steps[this.state.currentStep].valid}>
                                  Next
                                </button>
                              )}
                              {this.state.currentStep === this.state.steps.length - 1 && (
                                <button
                                  type="submit"
                                  disabled={this.state.saving}
                                  onClick={async () => {
                                    this.setState({ saving: true, secondsRemaining: 45 })
                                    this.waitForRedirect()

                                    const config = this.state.configuration
                                    delete config.Database.connectionError
                                    delete config.Database.connectionVerified
                                    delete config.Database.verifyingConnection

                                    config.Database.serverPort = parseInt(config.Database.serverPort)
                                    config.Mail.port = parseInt(config.Mail.port)
                                    config.Security.passwordMinimumLength = parseInt(config.Security.passwordMinimumLength)

                                    const { data } = await apolloClient.mutate({ mutation: SAVE_CONFIGURATION, variables: { configuration: config } })
                                  }}
                                  className="btn btn-success">
                                  Save
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                  </ApolloConsumer>
                </div>
              </div>
            </div>
          </div>
          {this.state.saving && (
            <Modal isOpen>
              <ModalBody>
                Server is restarting. You will be redirected to the admin registration in <b>{this.state.secondsRemaining}</b> seconds.
              </ModalBody>
            </Modal>
          )}
        </div>
      </Primary>
    )
  }
}