import React, { ReactNode } from 'react'
import { useFetch } from '../utils/useFetch'
import Router from 'next/router'
import ConfigurationContext from '../contexts/ConfigurationContext'
import UserContext from '../contexts/UserContext'
import LoadingIndicator from './LoadingIndicator'

import { IConfiguration } from '../../foundation/models/IConfiguration'
import ActivityMessageContainerComponent from './ActivityMessageContainer'
import LogRocket from 'logrocket'

const ApplicationInitializer: React.FC<{ configuration: IConfiguration }> = (props) => {
  const { response, isLoading, error, refetch } = useFetch(`/api/initialize`, { method: 'GET' })

  let redirectUri = ''
  let content: ReactNode = props.children

  if (error) {
    content = (
      <ActivityMessageContainerComponent>
        <div className="alert alert-danger">error.message</div>
      </ActivityMessageContainerComponent>
    )
  }
  if (isLoading) {
    content = (
      <ActivityMessageContainerComponent>
        <LoadingIndicator message="Loading..." />
      </ActivityMessageContainerComponent>
    )
  }
  let redirectReason = ''
  if (response) {
    if (
      response.user &&
      (window.location.pathname === '/login' || window.location.pathname === '/' || window.location.pathname === '')
    ) {
      redirectReason = 'Navigated to login or root or empty and already signed in'
      redirectUri = '/personal-info'
    }
    if (response.needsConfiguration && window.location.pathname !== '/oobe') {
      redirectReason = 'Navigated to a non-oobe page, but needs configuration'
      redirectUri = '/oobe'
    }
    if (!response.needsConfiguration && window.location.pathname.toLowerCase() === '/oobe') {
      redirectReason = 'Navigated to oobe but already has configuration'
      redirectUri = '/'
    }
    if (response.needsAdmin && !response.needsConfiguration && window.location.pathname !== '/register') {
      redirectReason = 'navigated to a page but needs the first user'
      redirectUri = '/register'
    }
  }

  if (redirectUri) {
    content = (
      <ActivityMessageContainerComponent>
        <LoadingIndicator message="Redirecting..." />
      </ActivityMessageContainerComponent>
    )
    LogRocket.log(`Redirecting to ${redirectUri} because ${redirectReason}`)
    Router.push(redirectUri)
  }
  if (response?.user) {
    LogRocket.identify(response?.user.userAccountId)
  }
  return (
    <div>
      <ConfigurationContext.Provider value={response ? response.configuration : props.configuration}>
        <UserContext.Provider value={{ user: response?.user, refresh: refetch, hasInitialized: true }}>
          {content}
        </UserContext.Provider>
      </ConfigurationContext.Provider>
    </div>
  )
}

export default ApplicationInitializer
