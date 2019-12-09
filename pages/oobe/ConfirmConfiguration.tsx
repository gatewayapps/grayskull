import React from 'react'
import PropTypes from 'prop-types'
import { IConfiguration } from '../../server/data/models/IConfiguration'

export class ConfirmConfiguration extends React.PureComponent<IConfirmConfigurationProps> {
  componentDidMount() {
    this.props.onValidationChanged(this.props.stepIndex, true)
  }

  renderConfigSection(section) {
    const keys = Object.keys(this.props.configuration[section])

    return (
      <div>
        <h6>{section} Settings</h6>
        <ul>
          {keys.map(
            (k) =>
              this.shouldRender(k) && (
                <li>
                  <b>{k}</b> - {this.getValue(this.props.configuration[section][k])}
                </li>
              )
          )}
        </ul>
      </div>
    )
  }

  shouldRender(k) {
    return !['provider', 'connectionVerified', 'verifyingConnection', 'connectionError', 'certificate', 'privateKey'].includes(k)
  }

  getValue(v) {
    if (v === false) {
      return 'false'
    }
    if (v === true) {
      return 'true'
    }
    if (v === undefined) {
      return 'Not Set'
    }
    return v
  }

  render() {
    return (
      <div>
        <h5>Confirm Configuration</h5>

        <div className="card-text">{this.renderConfigSection('Server')}</div>
        <div className="card-text">{this.renderConfigSection('Mail')}</div>
        <div className="card-text">{this.renderConfigSection('Security')}</div>

        <p className="card-text mt-4">When you click Save, your configuration will be written to disk and Grayskull will restart.</p>
      </div>
    )
  }
}

export interface IConfirmConfigurationProps {
  stepIndex: number
  configuration: IConfiguration
  onValidationChanged: (stepIndex: number, isValid: boolean, errors?: any[]) => void
}

export default ConfirmConfiguration
