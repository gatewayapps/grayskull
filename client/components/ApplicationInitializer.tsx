import React, { useState, ComponentProps, ReactNode } from 'react'
import { useFetch } from '../utils/useFetch'

import ConfigurationContext from '../contexts/ConfigurationContext'
import UserContext from '../contexts/UserContext'
import LoadingIndicator from './LoadingIndicator'
import BackgroundCoverComponent from './BackgroundCover'

const ApplicationInitializer: React.FC = (props) => {
  const { response, isLoading, error, refetch } = useFetch(`/api/initialize`, { method: 'GET' })

  let redirectUri: string = ''
  let content: ReactNode = props.children

  if (error) {
    content = (
      <BackgroundCoverComponent>
        <div className="alert alert-danger">error.message</div>
      </BackgroundCoverComponent>
    )
  }
  if (isLoading) {
    content = (
      <BackgroundCoverComponent>
        <LoadingIndicator message="Loading..." />
      </BackgroundCoverComponent>
    )
  }
  if (response) {
    if (response.user && window.location.pathname === '/login') {
      redirectUri = '/personal-info'
    }
    if (response.needsConfiguration && window.location.pathname !== '/oobe') {
      redirectUri = '/oobe'
    }
    if (!response.needsConfiguration && window.location.pathname.toLowerCase() === '/oobe') {
      redirectUri = '/'
    }
    if (response.needsAdmin && !response.needsConfiguration && window.location.pathname !== '/register') {
      redirectUri = '/register'
    }
  }

  if (redirectUri) {
    content = (
      <BackgroundCoverComponent>
        <LoadingIndicator message="Redirecting..." />
      </BackgroundCoverComponent>
    )
    window.location.replace(redirectUri)
  }

  return (
    <div>
      <ConfigurationContext.Provider value={response?.configuration}>
        <UserContext.Provider value={{ user: response?.user, refresh: refetch }}>{content}</UserContext.Provider>
      </ConfigurationContext.Provider>
    </div>
  )
}

export default ApplicationInitializer
