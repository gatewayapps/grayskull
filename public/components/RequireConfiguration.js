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
  state = {
    initialized: false,
    configuration: undefined
  }

  async componentDidMount() {
    const { data } = await this.apolloClient.query({
      query: GET_CONFIGURATION_QUERY,
      fetchPolicy: 'network-only'
    })
    if (data && data.securityConfiguration && data.serverConfiguration) {
      this.setState({
        initialized: true,
        configuration: data
      })
    } else {
      const state = generateRoutingState(this.props.router)
      window.location.replace(`/login?state=${state}`)
    }
  }

  render() {
    return (
      <ApolloConsumer>
        {(apolloClient) => {
          this.apolloClient = apolloClient
          if (!this.state.initialized) {
            return <LoadingIndicator />
          }
          return <ConfigurationContext.Provider value={{ configuration: this.state.user }}>{this.props.children(this.state.configuration)}</ConfigurationContext.Provider>
        }}
      </ApolloConsumer>
    )
  }
}

export default withRouter(RequireConfiguration)
