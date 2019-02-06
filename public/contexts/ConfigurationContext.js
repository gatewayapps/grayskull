import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

const ConfigurationContext = React.createContext({
  configuration: undefined
})

export default ConfigurationContext
export class ConfigurationProvider extends PureComponent {
  state = {
    configuration: undefined
  }

  setConfiguration = (configuration) => {
    this.setState({ configuration })
  }

  render() {
    return <ConfigurationContext.Provider value={{ ...this.state, setConfiguration: this.setConfiguration }}>{this.props.children}</ConfigurationContext.Provider>
  }
}

export const ConfigurationConsumer = (props) => <ConfigurationContext.Consumer>{props.children}</ConfigurationContext.Consumer>

ConfigurationConsumer.propTypes = {
  children: PropTypes.func.isRequired
}
