import gql from 'graphql-tag'
import DocumentTitle from 'react-document-title'
import React, { Component } from 'react'

import ConfigurationContext from '../contexts/ConfigurationContext'

import LoadingIndicator from './LoadingIndicator'

const GET_CONFIGURATION_QUERY = gql`
  query GET_CONFIGURATION_QUERY {
    securityConfiguration {
      multifactorRequired
      passwordRequiresNumber
      passwordRequiresSymbol
      passwordRequiresLowercase
      passwordRequiresUppercase
      passwordMinimumLength
      allowSignup
    }
    serverConfiguration {
      realmName
      realmLogo
      baseUrl
    }
  }
`

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
