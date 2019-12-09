import gql from 'graphql-tag'

import React from 'react'
import { useQuery } from 'react-apollo'

import LoadingIndicator from './LoadingIndicator'
import ErrorMessage from './ErrorMessage'

const GET_CONFIGURATION_QUERY = gql`
  query GET_CONFIGURATION_QUERY {
    configuration {
      Security {
        passwordRequiresLowercase
        passwordRequiresUppercase
        passwordRequiresNumber
        passwordRequiresSymbol
        passwordMinimumLength
        multifactorRequired
        accessTokenExpirationSeconds
        allowSignup
      }
      Server {
        baseUrl
        realmName
        realmLogo
      }
    }
  }
`

const WithConfiguration = (props) => {
  const { loading, error, data } = useQuery(GET_CONFIGURATION_QUERY, { fetchPolicy: 'network-only' })
  if (loading) {
    return <LoadingIndicator message="Loading configuration..." />
  }
  if (error) {
    return <ErrorMessage error={error} />
  }
  if (data) {
    return props.children({ configuration: data.configuration })
  }
}

export default WithConfiguration
