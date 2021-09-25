import React from 'react'
import { Router, useRouter, withRouter } from 'next/router'
import LoadingIndicator from '../presentation/components/LoadingIndicator'
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

export interface LogoutPageProps {
	router: Router
}

const Logout = (props: LogoutPageProps) => {
	const router = useRouter()
	const [logout, { loading, data, error }] = useMutation(LOGOUT_MUTATION)
	if (!loading && !data) {
		logout()
	}

	const { redirect_uri } = props.router.query

	const completeLogout = async (refresh) => {
		deleteCookie('sid')
		if (refresh) {
			await refresh()
		}
		if (redirect_uri && !Array.isArray(redirect_uri)) {
			window.location.replace(redirect_uri)
		}
		router.push('/')
		router.replace('/')
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

Logout.getInitialProps = ({ query, res }) => {
	const locals = res ? res.locals : {}
	return { query, ...locals }
}

export default withRouter(Logout)
