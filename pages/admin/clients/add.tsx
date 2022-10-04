/* eslint-disable @typescript-eslint/camelcase */
import gql from 'graphql-tag'
import debounce from 'lodash/debounce'
import Link from 'next/link'
import React from 'react'
import { ApolloConsumer, Mutation, MutationResult, Query, QueryResult } from 'react-apollo'
import uuid from 'uuid/v4'
import ErrorMessage from '../../../presentation/components/ErrorMessage'

import generateSecret from '../../../presentation/utils/generateSecret'
import { ALL_CLIENTS_QUERY } from './index'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'
import ClientForm from '../../../presentation/components/ClientForm'
import { GrantTypes } from '../../../foundation/constants/grantTypes'

import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'
import { Client, CreateClientOperationArgs } from '../../../foundation/types/types'
import ApolloClient from 'apollo-client'

const CREATE_CLIENT_MUTATION = gql`
	mutation CREATE_CLIENT_MUTATION($data: CreateClientArgs!) {
		createClient(data: $data) {
			client_id
		}
	}
`

const CHECK_CLIENT_ID_QUERY = gql`
	query CHECK_CLIENT_ID_QUERY($client_id: String!) {
		client(where: { client_id: $client_id }) {
			client_id
		}
	}
`

const GET_SCOPES_FOR_CLIENT_QUERY = gql`
	query GET_SCOPES_FOR_CLIENT_QUERY {
		scopes {
			id
			clientDescription
			required
		}
		grantTypes {
			id
			name
		}
	}
`

export const ClientAddPage: React.FC = () => {
	const [client, setClient] = React.useState<Client>({
		client_id: uuid(),
		name: '',
		logoImageUrl: '/grayskull.png',
		description: '',
		baseUrl: '',
		homePageUrl: '',
		public: true,
		redirectUris: [{ key: uuid(), value: '' }],
		secret: null,
		pinToHeader: null,
		scopes: [],
		isActive: true,
		AuthorizationFlows: [GrantTypes.AuthorizationCode, GrantTypes.RefreshToken],
		TokenSigningMethod: 'RS256'
	})
	const [customizeClientId, setCustomizeClientId] = React.useState(false)
	const [clientIdValid, setClientIdValid] = React.useState(true)
	const [clientFormValid, setClientFormValid] = React.useState(false)
	const [result, setResult] = React.useState<any>()

	const checkClientId = debounce(async (clientId, apolloClient) => {
		if (!clientId) {
			setClientIdValid(false)
			return
		}
		const { data } = await apolloClient.query({
			query: CHECK_CLIENT_ID_QUERY,
			variables: { client_id: clientId },
			fetchPolicy: 'network-only'
		})
		if (data && data.client) {
			setClientIdValid(false)
		} else {
			setClientIdValid(true)
		}
	}, 300)

	const onClientIdChange = (e: string, apollo: ApolloClient<object>) => {
		checkClientId(e, apollo)
		setClient({ ...client, client_id: e })
	}

	const submitClient = async (evt, createClient) => {
		evt.preventDefault()
		if (!clientIdValid || !clientFormValid) {
			return
		}

		const { redirectUris, scopes, AuthorizationFlows, ...rest } = client
		const secret = generateSecret()

		const clientData: Partial<CreateClientOperationArgs> = rest
		if (redirectUris) {
			clientData.redirectUris = JSON.stringify(redirectUris.map((r) => r.value))
		}
		if (scopes) {
			clientData.scopes = JSON.stringify(scopes)
		}
		if (AuthorizationFlows) {
			clientData.AuthorizationFlows = JSON.stringify(AuthorizationFlows)
		}

		clientData.secret = secret

		const res = await createClient({ variables: { data: clientData } })

		if (res.data && res.data.createClient) {
			setResult({
				client_id: res.data.createClient.client_id,
				secret
			})
		}
	}

	return (
		<AuthenticatedRoute permission={Permissions.ADMIN}>
			<Query query={GET_SCOPES_FOR_CLIENT_QUERY}>
				{({ data, error, loading: loadingScopes }: QueryResult) => {
					if (loadingScopes) {
						return <LoadingIndicator />
					}

					if (error) {
						return <ErrorMessage error={error} />
					}

					return (
						<Mutation mutation={CREATE_CLIENT_MUTATION} refetchQueries={[{ query: ALL_CLIENTS_QUERY }]}>
							{(createClient, { error, loading }: MutationResult) => (
								<div className="container pt-4">
									<form onSubmit={(e) => submitClient(e, createClient)}>
										<div className="card">
											<div className="card-header">Create Client</div>
											<div className="card-body">
												<ErrorMessage error={error} />
												<div className="form-group row">
													<label className="col-sm-12 col-md-3 col-form-label" htmlFor="client_id">
														Client ID
													</label>
													<div className="col-sm-12 col-md-9">
														{!customizeClientId && (
															<>
																<span className="py-2" style={{ verticalAlign: 'middle' }}>
																	{client.client_id}
																</span>
																<button
																	type="button"
																	className="btn btn-link btn-sm"
																	onClick={() => setCustomizeClientId(!customizeClientId)}>
																	Customize
																</button>
															</>
														)}
														{customizeClientId && (
															<ApolloConsumer>
																{(apolloClient) => (
																	<input
																		type="text"
																		className={`form-control ${clientIdValid ? 'is-valid' : 'is-invalid'}`}
																		name="client_id"
																		value={client.client_id}
																		onChange={(e) => onClientIdChange(e.target.value, apolloClient)}
																		required
																		readOnly={result !== undefined}
																		aria-describedby="clientIdHelpBlock"
																		autoFocus
																	/>
																)}
															</ApolloConsumer>
														)}
														<div id="clientIdHelpBlock" className="small form-text text-muted">
															We recommend using the generated Client ID but you can customize it as long as the value
															is unique.
														</div>
													</div>
												</div>
												<ClientForm
													client={client}
													onChange={(name, value) => setClient({ ...client, [name]: value })}
													onValidated={(valid: boolean) => setClientFormValid(valid)}
													scopes={data.scopes}
													grantTypes={data.grantTypes}
												/>
												{result && (
													<div className="alert alert-success">
														<p>
															Success! Your client_id and client_secret that your application will use to authenticate
															users are listed below. Please note these values down as this is the only time the
															client_secret will be visible.
														</p>
														<div>
															<strong>Client Id:</strong> {result.client_id}
														</div>
														<div>
															<strong>Secret:</strong> {result.secret}
														</div>
													</div>
												)}
											</div>
											{!result && (
												<div className="card-footer clearfix">
													<div className="btn-toolbar float-right">
														<Link href="/admin/clients">
															<a className="btn btn-outline-secondary mr-3">
																<i className="fal fa-times" /> Cancel
															</a>
														</Link>
														<button
															className="btn btn-success"
															type="submit"
															disabled={loading || !clientIdValid || !clientFormValid}>
															<i className="fal fa-save" /> Create
														</button>
													</div>
												</div>
											)}
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

export default ClientAddPage
