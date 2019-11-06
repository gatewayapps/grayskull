import React from 'react'
import Router from 'next/router'
import LoadingIndicator from '../client/components/LoadingIndicator'
import { NextPage } from 'next'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Jumbotron from 'reactstrap/lib/Jumbotron'

const LOGOUT_MUTATION = gql`
  mutation LOGOUT_MUTATION {
    logout {
      success
      error
      message
    }
  }
`

const Logout: NextPage = (props) => {
  const [logout, { loading, data }] = useMutation(LOGOUT_MUTATION)
  if (!loading && !data) {
    logout()
  }
  if (loading) {
    return (
      <Jumbotron>
        <LoadingIndicator message="Logging you out..." />
      </Jumbotron>
    )
  } else {
    window.location.href = '/'
    return (
      <Jumbotron>
        <LoadingIndicator message="Logging you out..." />
      </Jumbotron>
    )
  }
}

export default Logout
