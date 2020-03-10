import React, { ReactNode, useState } from 'react'

import Router from 'next/router'
import ConfigurationContext from '../contexts/ConfigurationContext'
import UserContext from '../contexts/UserContext'
import LoadingIndicator from './LoadingIndicator'

import { IConfiguration } from '../../foundation/models/IConfiguration'
import ActivityMessageContainerComponent from './ActivityMessageContainer'

const ApplicationInitializer: React.FC<{ configuration: IConfiguration }> = (props) => {
	const [response, setResponse] = useState(undefined)
	const [error, setError] = useState(undefined)
	const [busy, setBusy] = useState(false)

	const callInitialize = async () => {
		try {
			if (busy) {
				return
			}
			setBusy(true)
			const finalUrl = process.env.GRAYSKULL_BASE_URL
				? new URL('/api/initialize', process.env.GRAYSKULL_BASE_URL).href
				: '/api/initialize'
			const response = await fetch(finalUrl, { method: 'GET' })
			const json = await response.json()
			setResponse(json)
		} catch (err) {
			console.error(err)
			setError(err)
		} finally {
			setBusy(false)
		}
	}

	if (!busy && !response && !error) {
		callInitialize()
	}

	let redirectUri = ''
	let content: ReactNode = props.children

	if (error) {
		content = (
			<ActivityMessageContainerComponent>
				<div className="alert alert-danger">{error.message}</div>
			</ActivityMessageContainerComponent>
		)
	}
	if (busy) {
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
		// if (!redirectUri) {
		// 	if (!response.needsConfiguration && !response.needsAdmin && !response.user && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
		// 		redirectUri = '/login'
		// 	}
		// }
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
				<UserContext.Provider
					value={{
						user: response?.user,
						refresh: callInitialize,
						hasInitialized: true
					}}>
					{content}
				</UserContext.Provider>
			</ConfigurationContext.Provider>
		</div>
	)
}

export default ApplicationInitializer
