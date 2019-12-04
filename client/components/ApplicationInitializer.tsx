import React, { useState, ComponentProps, ReactNode } from 'react'
import { useFetch } from '../utils/useFetch'
import Router from 'next/router'
import ConfigurationContext from '../contexts/ConfigurationContext'
import UserContext from '../contexts/UserContext'
import LoadingIndicator from './LoadingIndicator'
import BackgroundCoverComponent from './BackgroundCover'
import { IConfiguration } from '../../server/data/models/IConfiguration'
import ActivityMessageContainerComponent from './ActivityMessageContainer'

const ApplicationInitializer: React.FC<{ configuration: IConfiguration }> = (props) => {
  const { response, isLoading, error, refetch } = useFetch(`/api/initialize`, { method: 'GET' })

  let redirectUri: string = ''
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
  if (response) {
    if (
      response.user &&
      (window.location.pathname === '/login' || window.location.pathname === '/' || window.location.pathname === '')
    ) {
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
      <ActivityMessageContainerComponent>
        <LoadingIndicator message="Redirecting..." />
      </ActivityMessageContainerComponent>
    )
    Router.push(redirectUri)
  }

  return (
    <div>
      <ConfigurationContext.Provider value={response ? response.configuration : props.configuration}>
        <UserContext.Provider value={{ user: response?.user, refresh: refetch }}>{content}</UserContext.Provider>
      </ConfigurationContext.Provider>
    </div>
  )
}

export default ApplicationInitializer
