import React, { Component } from 'react'

import ConfigurationContext from '../contexts/ConfigurationContext'

import LoadingIndicator from './LoadingIndicator'

class RequireConfiguration extends Component {
	render() {
		return (
			<ConfigurationContext.Consumer>
				{(configuration) => {
					if (configuration) {
						return this.props.children(configuration)
					} else {
						return <LoadingIndicator />
					}
				}}
			</ConfigurationContext.Consumer>
		)
	}
}

export default RequireConfiguration
