import React from 'react'
import Router from 'next/router'
import LoadingIndicator from '../presentation/components/LoadingIndicator'
import { NextPage } from 'next'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import ErrorMessage from '../presentation/components/ErrorMessage'

import ActivityMessageContainerComponent from '../presentation/components/ActivityMessageContainer'
import UserContext from '../presentation/contexts/UserContext'

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

const LOGOUT_MUTATION = gql`
  mutation LOGOUT_MUTATION {
    logout {
      success
      error
      message
    }
  }
`

const Logout: NextPage = () => {
  const [logout, { loading, data, error }] = useMutation(LOGOUT_MUTATION)
  if (!loading && !data) {
    logout()
  }

  const completeLogout = async (refresh) => {
    deleteCookie('sid')
    if (refresh) {
      await refresh()
    }
    Router.push('/')
    Router.replace('/')
  }

  if (error) {
    completeLogout(undefined)
    return (
      <ActivityMessageContainerComponent>
        <ErrorMessage error={error} />
      </ActivityMessageContainerComponent>
    )
  }

  return (
    <UserContext.Consumer>
      {({ refresh }) => {
        if (data && data.logout && data.logout.success) {
          completeLogout(refresh)
        }
        return (
          <ActivityMessageContainerComponent>
            <LoadingIndicator message="Logging you out..." />
          </ActivityMessageContainerComponent>
        )
      }}
    </UserContext.Consumer>
  )
}

export default Logout
