import React from 'react'
import Primary from '../../layouts/primary'
import { GettingStarted } from './GettingStarted'
import { ServerConfiguration } from './ServerConfiguration'
import { DatabaseConfiguration } from './DatabaseConfiguration'
export default class OobeIndex extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
        }
      ],
      configuration: {
        Server: {
          realmName: 'Grayskull',
          baseUrl: 'http://127.0.0.1'
        },
        Database: {
          provider: 'postgres',
          adminUsername: '',
          adminPassword: '',
          serverAddress: '',
          serverPort: '5432',
          databaseName: '',
          connectionVerified: false
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
    }
  }

  onValidationChanged = (stepIndex, isValid, errors) => {
    const steps = this.state.steps
    steps[stepIndex].valid = isValid

    this.setState({
      steps
    })
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
                          <button
                            type="submit"
                            onClick={() => {
                              this.setState({ currentStep: this.state.currentStep + 1 })
                            }}
                            className="btn btn-outline-success"
                            disabled={!this.state.steps[this.state.currentStep].valid}>
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Primary>
    )
  }
}
