import gql from 'graphql-tag'

import React from 'react'
import { useQuery } from 'react-apollo'

import LoadingIndicator from './LoadingIndicator'
import ErrorMessage from './ErrorMessage'

const GET_ME_QUERY = gql`
  query GET_ME_QUERY {
    me {
      userAccountId
      firstName
      lastName
      displayName
      birthday
      gender
      profileImageUrl
      permissions
      lastPasswordChange
      emailAddress
      otpEnabled
    }
  }
`

const WithUser = (props) => {
  const { loading, error, data } = useQuery(GET_ME_QUERY, { fetchPolicy: 'network-only' })
  if (loading) {
    return <LoadingIndicator message="Checking if you are logged in..." />
  }
  if (error) {
    return <ErrorMessage error={error} />
  }
  if (data) {
    return props.children({ user: data.me })
  }
}

export default WithUser
