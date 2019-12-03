import React from 'react'
import Router from 'next/router'
import LoadingIndicator from '../client/components/LoadingIndicator'
import { NextPage } from 'next'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Jumbotron from 'reactstrap/lib/Jumbotron'
import ErrorMessage from '../client/components/ErrorMessage'
import BackgroundCoverComponent from '../client/components/BackgroundCover'

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
  const [logout, { loading, data, error }] = useMutation(LOGOUT_MUTATION)
  if (!loading && !data) {
    logout()
  }

  if (loading) {
    return (
      <BackgroundCoverComponent>
        <Jumbotron>
          <LoadingIndicator message="Logging you out..." />
        </Jumbotron>
      </BackgroundCoverComponent>
    )
  } else if (error) {
    return (
      <BackgroundCoverComponent>
        <Jumbotron>
          <ErrorMessage error={error} />
        </Jumbotron>
      </BackgroundCoverComponent>
    )
  } else if (data && data.logout && data.logout.success) {
    deleteCookie('sid')
    window.location.href = '/'
    return (
      <BackgroundCoverComponent>
        <Jumbotron>
          <LoadingIndicator message="Logging you out..." />
        </Jumbotron>
      </BackgroundCoverComponent>
    )
  } else {
    return (
      <BackgroundCoverComponent>
        <Jumbotron>
          <LoadingIndicator message="Logging you out..." />
        </Jumbotron>
      </BackgroundCoverComponent>
    )
  }
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export default Logout
