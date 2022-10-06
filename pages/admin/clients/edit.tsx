/* eslint-disable @typescript-eslint/camelcase */
import gql from 'graphql-tag'
import Link from 'next/link'
import React from 'react'
import Router from 'next/router'
import { Mutation, MutationResult, Query, QueryResult } from 'react-apollo'
import uuid from 'uuid/v4'
import ClientForm from '../../../presentation/components/ClientForm'
import ErrorMessage from '../../../presentation/components/ErrorMessage'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'

import { ALL_CLIENTS_QUERY } from './index'

import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'
import { Client, UpdateClientOperationArgs } from '../../../foundation/types/types'

const UPDATE_CLIENT_QUERY = gql`
	query UPDATE_CLIENT_QUERY($client_id: String!) {
		client(where: { client_id: $client_id }) {
			client_id
			name
			logoImageUrl
			baseUrl
			homePageUrl
			redirectUris
			description
			scopes
			public
			pinToHeader
			AuthorizationFlows
			TokenSigningMethod
		}

		grantTypes {
			id
			name
		}

		scopes {
			id
			clientDescription
			required
		}
	}
`

const UPDATE_CLIENT_MUTATION = gql`
	mutation UPDATE_CLIENT_MUTATION($data: UpdateClientArgs!) {
		updateClient(data: $data) {
			client_id
			name
			logoImageUrl
			baseUrl
			homePageUrl
			redirectUris
			description
			scopes
			public
			pinToHeader
			AuthorizationFlows
		}
	}
`

export const ClientEditPage: React.FC = () => {
	const [client, setClient] = React.useState<Partial<Client>>({})
	const [clientFormValid, setClientFormValid] = React.useState(false)
	const [result, setResult] = React.useState<any>()
	const id = Router.query.id

	const onClientFormValidated = (isValid) => {
		setClientFormValid(isValid)
	}

	const submitClient = async (evt, clientId, updateClient) => {
		evt.preventDefault()

		if (!clientFormValid) {
			return
		}

		setResult(undefined)

		const { redirectUris, scopes, AuthorizationFlows, ...data } = client

		data.client_id = clientId

		const clientData: Partial<UpdateClientOperationArgs> = data

		if (redirectUris) {
			clientData.redirectUris = JSON.stringify(redirectUris.map((r) => r.value))
		}
		if (scopes) {
			clientData.scopes = JSON.stringify(scopes)
		}
		if (AuthorizationFlows) {
			clientData.AuthorizationFlows = JSON.stringify(AuthorizationFlows)
		}

		const res = await updateClient({ variables: { data: clientData } })

		if (res.data && res.data.updateClient) {
			setResult({ client_id: res.data.updateClient.client_id })
		}
	}

	return (
		<AuthenticatedRoute permission={Permissions.ADMIN}>
			<Query query={UPDATE_CLIENT_QUERY} variables={{ client_id: id }}>
				{({ data, error, loading: loadingClient }: QueryResult) => {
					if (loadingClient) {
						return <LoadingIndicator />
					}

					if (error) {
						return <ErrorMessage error={error} />
					}

					const { client: currentClient, scopes, grantTypes } = data

					const parsedClient = {
						...currentClient,
						redirectUris: JSON.parse(currentClient.redirectUris).map((r) => ({ key: uuid(), value: r })),
						scopes: JSON.parse(currentClient.scopes),
						AuthorizationFlows: JSON.parse(currentClient.AuthorizationFlows)
					}

					const mergedClient = {
						...parsedClient,
						...client
					}

					return (
						<Mutation mutation={UPDATE_CLIENT_MUTATION} refetchQueries={[{ query: ALL_CLIENTS_QUERY }]}>
							{(updateClient, { error: updateError, loading: saving }: MutationResult) => (
								<div className="container pt-4">
									<form onSubmit={(e) => submitClient(e, mergedClient.client_id, updateClient)}>
										<div className="card">
											<div className="card-header">Update Client</div>
											<div className="card-body">
												<ErrorMessage error={updateError} />
												<div className="form-group row">
													<label className="col-sm-12 col-md-3 col-form-label" htmlFor="client_id">
														Client ID
													</label>
													<div className="col-sm-12 col-md-9">
														<span className="py-2" style={{ verticalAlign: 'middle' }}>
															{mergedClient.client_id}
														</span>
													</div>
												</div>
												<ClientForm
													client={mergedClient}
													onChange={(name, value) => setClient({ ...client, [name]: value })}
													onValidated={onClientFormValidated}
													scopes={scopes}
													grantTypes={grantTypes}
												/>
												{result && <div className="alert alert-success">Success!</div>}
											</div>
											<div className="card-footer justify-content-end">
												<div className="btn-toolbar">
													<Link href="/admin/clients">
														<a className="btn btn-outline-secondary mr-3">
															<i className="fal fa-fw fa-times" /> Cancel
														</a>
													</Link>
													<button className="btn btn-success" type="submit" disabled={saving || !clientFormValid}>
														<i className="fal fa-fw fa-save" /> Update
													</button>
												</div>
											</div>
										</div>
									</form>
								</div>
							)}
						</Mutation>
					)
				}}
			</Query>
		</AuthenticatedRoute>
	)
}

export default ClientEditPage
