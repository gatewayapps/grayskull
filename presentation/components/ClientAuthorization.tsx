import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import LoadingIndicator from './LoadingIndicator'
import _ from 'lodash'
import SignOut from './SignOut'

import UserContext from '../contexts/UserContext'
import ActivityMessageContainerComponent from './ActivityMessageContainer'

const AUTHORIZE_CLIENT_MUTATION = gql`
	mutation AUTHORIZE_CLIENT_MUTATION(
		$client_id: String!
		$responseType: String!
		$redirectUri: String!
		$scope: String
		$state: String
		$nonce: String
	) {
		authorizeClient(
			data: {
				client_id: $client_id
				responseType: $responseType
				redirectUri: $redirectUri
				scope: $scope
				state: $state
				nonce: $nonce
			}
		) {
			pendingScopes
			redirectUri
		}
	}
`

const UPDATE_CLIENT_SCOPES_MUTATION = gql`
	mutation UPDATE_CLIENT_SCOPES_MUTATION($client_id: String!, $allowedScopes: [String!]!, $deniedScopes: [String!]!) {
		updateClientScopes(data: { client_id: $client_id, allowedScopes: $allowedScopes, deniedScopes: $deniedScopes })
	}
`

const ClientAuthorizationComponent: React.FC<IClientAuthorizationProps> = (props) => {
	const [isSaving, setIsSaving] = useState(false)
	const [pendingScopes, setPendingScopes] = useState<string[]>([])
	const [allowedScopes, setAllowedScopes] = useState<string[]>([])
	const [deniedScopes, setDeniedScopes] = useState<string[]>([])

	const [authorizeClient, { data: authorizeClientData, loading: authorizeClientLoading }] = useMutation(
		AUTHORIZE_CLIENT_MUTATION,
		{
			variables: {
				client_id: props.client.client_id,
				responseType: props.responseType,
				redirectUri: props.redirectUri,
				scope: props.scope,
				state: props.state,
				nonce: props.nonce
			}
		}
	)

	const [updateScopes, { data: updateScopesData }] = useMutation(UPDATE_CLIENT_SCOPES_MUTATION, {
		variables: {
			client_id: props.client.client_id,
			allowedScopes: allowedScopes,
			deniedScopes: deniedScopes
		}
	})

	const handleScopeCheckChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target
		if (checked) {
			if (!allowedScopes.includes(name)) {
				setAllowedScopes([...allowedScopes, name])
			}
			setDeniedScopes(deniedScopes.filter((s) => s !== name))
		} else {
			if (!deniedScopes.includes(name)) {
				setDeniedScopes([...deniedScopes, name])
			}
			setAllowedScopes(allowedScopes.filter((s) => s !== name))
		}
	}

	const updateClientScopes = async () => {
		updateScopes()
	}

	useEffect(() => {
		if (updateScopesData && updateScopesData.updateClientScopes) {
			authorizeClient()
		}
	}, [authorizeClient, updateScopesData])

	const onDenyClicked = async () => {
		const query: string[] = ['error=consent_required']
		if (props.state) {
			query.push(`state=${encodeURIComponent(props.state)}`)
		}

		window.location.replace(`${props.redirectUri}?${query.join('&')}`)
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		setIsSaving(true)
		updateClientScopes()
	}

	useEffect(() => {
		authorizeClient()
	}, [authorizeClient, props.client.client_id])

	if (authorizeClientData && authorizeClientData.authorizeClient) {
		if (isSaving) {
			setIsSaving(false)
		}
		if (authorizeClientData.authorizeClient.redirectUri) {
			window.location.replace(authorizeClientData.authorizeClient.redirectUri)
			return <LoadingIndicator message="Redirecting..." />
		}
		if (authorizeClientData.authorizeClient.pendingScopes) {
			if (!_.isEqual(authorizeClientData.authorizeClient.pendingScopes, pendingScopes)) {
				setAllowedScopes(authorizeClientData.authorizeClient.pendingScopes)
				setPendingScopes(authorizeClientData.authorizeClient.pendingScopes)
			}
		}
	}
	if (authorizeClientLoading) {
		return (
			<ActivityMessageContainerComponent>
				<LoadingIndicator />
			</ActivityMessageContainerComponent>
		)
	}

	return (
		<UserContext.Consumer>
			{({ user }: any) => (
				<form onSubmit={onSubmit}>
					<div className="card">
						<div className="card-header">Authorize {props.client.name}</div>
						<div className="card-body">
							<div className="row">
								<div className="col-lg-3">
									{props.client.logoImageUrl && <img src={props.client.logoImageUrl} style={{ width: '100%' }} />}
								</div>
								<div className="col-lg-9">
									<div className="mt-2">
										<strong>{props.client.name}</strong> would like to:
									</div>
									{props.scopes
										.filter((s) => pendingScopes.includes(s.id) && s.permissionLevel <= user.permissions)
										.map((scope) => (
											<div key={scope.id} className="form-check my-2 mx-4">
												<input
													type="checkbox"
													id={scope.id}
													disabled={scope.required}
													name={scope.id}
													className="form-check-input"
													checked={allowedScopes.includes(scope.id)}
													onChange={handleScopeCheckChanged}
												/>
												<label htmlFor={scope.id} className="form-check-label">
													{scope.userDescription}
												</label>
											</div>
										))}
								</div>
							</div>
							<div className="d-flex align-items-center justify-content-center mt-2">
								<div>
									Logged in as{' '}
									<strong>
										{user.firstName} {user.lastName}
									</strong>{' '}
									(<SignOut includeState>Not You?</SignOut>)
								</div>
							</div>
						</div>
						<div className="card-footer clearfix">
							<div className="btn-toolbar float-right">
								<button
									type="button"
									className="btn btn-outline-danger mr-3"
									disabled={isSaving}
									onClick={onDenyClicked}>
									<i className="fal fa-times fa-fw" /> Deny
								</button>
								<button type="submit" className="btn btn-success" disabled={isSaving}>
									<i className="fal fa-check fa-fw" /> Authorize
								</button>
							</div>
						</div>
					</div>
				</form>
			)}
		</UserContext.Consumer>
	)
}

export interface IClientAuthorizationProps {
	client: {
		client_id: string
		name: string
		logoImageUrl: string
	}
	responseType: string
	redirectUri: string
	scope: string
	scopes: Array<{ id: string; userDescription: string; permissionLevel: number; required: boolean }>
	state?: string
	nonce?: string
}

export default ClientAuthorizationComponent
