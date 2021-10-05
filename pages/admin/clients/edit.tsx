import gql from 'graphql-tag'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import uuid from 'uuid/v4'
import ClientForm from '../../../presentation/components/ClientForm'
import ErrorMessage from '../../../presentation/components/ErrorMessage'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'

import { ALL_CLIENTS_QUERY } from './index'

import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import { Permissions } from '../../../foundation/constants/permissions'
import { stringValue } from 'aws-sdk/clients/finspacedata'

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

type Client = {
	name?: string
	logoImageUrl?: string
	description?: string
	baseUrl?: string
	homePageUrl?: string
	redirectUris?: stringValue[]
	scopes?: string[]
	AuthorizationFlows?: string
	public?: boolean
}

const ClientEditPage = (props) => {
	const [editClient, setEditClient] = React.useState<Client>({})
	const [clientFormValid, setClientFormValid] = React.useState(false)
	const [results, setResults] = React.useState<Record<string, any>>()

	const handleClientFormChange = (name, value) => {
		setEditClient({
			...editClient,
			[name]: value
		})
	}

	const onClientFormValidated = (isValid) => {
		setClientFormValid(isValid)
	}

	const submitClient = async (evt, clientId, updateClient) => {
		evt.preventDefault()
		if (!clientFormValid) {
			return
		}

		setResults({ results: undefined })
		const { redirectUris, scopes, AuthorizationFlows, ...data } = editClient

		const updatedClient = {
			...data,
			client_id: clientId,
			redirectUris: redirectUris ? JSON.stringify(editClient?.redirectUris?.map((r) => r)) : '[]',
			scopes: scopes ? JSON.stringify(scopes) : '',
			AuthorizationFlows: AuthorizationFlows ? JSON.stringify(AuthorizationFlows) : ''
		}

		const res = await updateClient({ variables: { data: updatedClient } })

		if (res.data && res.data.updateClient) {
			setResults({
				results: {
					client_id: res.data.updateClient.client_id
				}
			})
		}
	}

	return (
		<AuthenticatedRoute permission={Permissions.Admin}>
			<Query query={UPDATE_CLIENT_QUERY} variables={{ client_id: props.query.id }}>
				{(result) => {
					const { data, error, loading: loadingClient } = result
					if (loadingClient) {
						return <LoadingIndicator />
					} else if (error) {
						return <ErrorMessage error={error} />
					} else {
						const { client, scopes, grantTypes } = data

						const parsedClient = {
							...client,
							redirectUris: JSON.parse(client.redirectUris).map((r) => ({ key: uuid(), value: r.value })),
							scopes: client.redirectUris ? JSON.parse(client.scopes) : '',
							AuthorizationFlows: client.AuthorizationFlows ? JSON.parse(client.AuthorizationFlows) : ''
						}

						const mergedClient = {
							...parsedClient,
							...editClient
						}

						return (
							<Mutation mutation={UPDATE_CLIENT_MUTATION} refetchQueries={[{ query: ALL_CLIENTS_QUERY }]}>
								{(updateClient, result) => {
									const { error: updateError, loading: saving } = result
									return (
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
															onChange={handleClientFormChange}
															onValidated={onClientFormValidated}
															scopes={scopes}
															grantTypes={grantTypes}
														/>
														{results && <div className="alert alert-success">Success!</div>}
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
									)
								}}
							</Mutation>
						)
					}
				}}
			</Query>
		</AuthenticatedRoute>
	)
}

ClientEditPage.getInitialProps = ({ query }) => {
	return { query }
}

ClientEditPage.propTypes = {
	query: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired
}

export default ClientEditPage
