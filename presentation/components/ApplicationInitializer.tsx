import React, { useState } from 'react'

import ConfigurationContext from '../contexts/ConfigurationContext'
import UserContext from '../contexts/UserContext'
import LoadingIndicator from './LoadingIndicator'

import { IConfiguration } from '../../foundation/models/IConfiguration'
import ActivityMessageContainerComponent from './ActivityMessageContainer'
import Router from 'next/router'

const ApplicationInitializer: React.FC<{ configuration: IConfiguration }> = (props) => {
	const [response, setResponse] = useState<any>(undefined)
	const [error, setError] = useState<any>(undefined)
	const [busy, setBusy] = useState(false)
	const [redirecting, setRedirecting] = React.useState(false)

	const callInitialize = async (redirectTo?: string) => {
		try {
			if (busy) {
				return
			}
			setBusy(true)
			const finalUrl = [null, 'null', undefined].includes(process.env.GRAYSKULL_BASE_URL)
				? '/api/initialize'
				: new URL('/api/initialize', process.env.GRAYSKULL_BASE_URL).href

			const response = await fetch(finalUrl, { method: 'GET' })
			const json = await response.json()

			let redirectUri = ''
			if (json) {
				if (
					json.user &&
					(window.location.pathname === '/login' || window.location.pathname === '/' || window.location.pathname === '')
				) {
					redirectUri = '/personal-info'
				}
				if (redirectTo) {
					redirectUri = redirectTo
				}
				if (json.needsConfiguration && window.location.pathname !== '/oobe') {
					redirectUri = '/oobe'
				}
				if (!json.needsConfiguration && window.location.pathname.toLowerCase() === '/oobe') {
					redirectUri = '/'
				}
				if (json.needsAdmin && !json.needsConfiguration && window.location.pathname !== '/register') {
					redirectUri = '/register'
				}
				// if (!redirectUri) {
				// 	if (!response.needsConfiguration && !response.needsAdmin && !response.user && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
				// 		redirectUri = '/login'
				// 	}
				// }
			}
			setResponse(json)

			if (redirectUri) {
				setRedirecting(true)

				await Router.push(redirectUri)

				setRedirecting(false)
			}
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

	const content = React.useMemo(() => {
		let innerContent: React.ReactNode = null
		if (error) {
			innerContent = <div className="alert alert-danger">{error.message}</div>
		} else if (busy) {
			innerContent = <LoadingIndicator message="Loading..." />
		} else if (redirecting) {
			innerContent = <LoadingIndicator message="Redirecting..." />
		}

		if (innerContent !== null) {
			return <ActivityMessageContainerComponent>{innerContent}</ActivityMessageContainerComponent>
		}

		return props.children
	}, [busy, error, props.children, redirecting])

	return (
		<div>
			<ConfigurationContext.Provider value={response ? response.configuration : props.configuration}>
				<UserContext.Provider
					value={{
						user: response?.user,
						refresh: callInitialize as any,
						hasInitialized: true
					}}>
					{content}
				</UserContext.Provider>
			</ConfigurationContext.Provider>
		</div>
	)
}

export default ApplicationInitializer
