import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import React, { Component } from 'react'
import { ApolloConsumer } from 'react-apollo'
import ConfigurationContext from '../contexts/ConfigurationContext'
import { generateRoutingState } from '../utils/routing'
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
