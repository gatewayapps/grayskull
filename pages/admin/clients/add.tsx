/* eslint-disable @typescript-eslint/camelcase */
import gql from 'graphql-tag'
import debounce from 'lodash/debounce'
import Link from 'next/link'
import React from 'react'
import { ApolloConsumer, Mutation, Query } from 'react-apollo'
import uuid from 'uuid/v4'
import ErrorMessage from '../../../presentation/components/ErrorMessage'

import generateSecret from '../../../presentation/utils/generateSecret'
import { ALL_CLIENTS_QUERY } from './index'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'
import ClientForm from '../../../presentation/components/ClientForm'
import { GrantType, GrantTypes } from '../../../foundation/constants/grantTypes'

import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import { Permissions } from '../../../foundation/constants/permissions'
import { useMutation } from 'react-apollo'
import { useQuery } from 'react-apollo'
import { ApolloError } from 'apollo-client'
import { getClient } from '../../../operations/data/client/getClient'

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

interface ClientTemplate {
	client_id: string
	name: string
	logoImageUrl: string
	description: string
	baseUrl: string
	homePageUrl: string
	public: boolean
	redirectUris: [{ key: string; value: string }]
	scopes: string
	AuthorizationFlows: string
	isActive: boolean
	TokenSigningMethod: string
	secret: string | null
}

const ClientAddPage = () => {
	const [client, setClient] = React.useState<ClientTemplate>({
		client_id: uuid(),
		name: '',
		logoImageUrl: '/grayskull.png',
		description: '',
		baseUrl: '',
		homePageUrl: '',
		public: true,
		redirectUris: [{ key: uuid(), value: '' }],
		scopes: '',
		AuthorizationFlows: '',
		isActive: true,
		TokenSigningMethod: 'RS256',
		secret: null
	})
	const [customizeClientId, setCustomizeClientId] = React.useState(false)
	const [clientIdValid, setClientIdValid] = React.useState(true)
	const [clientFormValid, setClientFormValid] = React.useState(true)
	const [result, setResult] = React.useState<any>()
	const [clients, setClients] = React.useState<
		Array<{
			client_id: string
			name: string
			baseUrl: string
			homePageUrl: string
		}>
	>([])
	const [error, setError] = React.useState<Error>()

	const checkClientId = debounce(async (apolloClient) => {
		if (client.client_id) {
			setClientIdValid(false)
			return
		}
		const { data } = await apolloClient.query({
			query: CHECK_CLIENT_ID_QUERY,
			variables: { client_id: client.client_id },
			fetchPolicy: 'network-only'
		})
		if (data && data.client) {
			setClientIdValid(false)
		} else {
			setClientIdValid(true)
		}
	}, 300)

	const handleClientFormChange = (name, value) => {
		setClient((prevState) => ({
			...prevState,
			client: {
				...client,
				[name]: value
			}
		}))
	}

	const handleChange = (evt) => {
		const { name, value } = evt.target
		if (name === 'redirectUris') {
			setClient({ ...client, redirectUris: value })
		} else if (name === 'scopes') {
			setClient({ ...client, scopes: value })
		} else if (name === 'AuthorizationFlows') {
			setClient({ ...client, AuthorizationFlows: value })
		} else {
			setClient((prevState) => ({
				...prevState,
				client: {
					...client,
					[name]: value
				}
			}))
		}
	}
	const handleClientIdChange = (evt, apolloClient) => {
		handleChange(evt)
		checkClientId(apolloClient)
	}

	const onClientFormValidated = (isValid) => {
		setClientFormValid(isValid)
	}

	const submitClient = async (evt, createClient) => {
		evt.preventDefault()
		if (!clientIdValid || !clientFormValid) {
			return
		}
		const secret = generateSecret()

		let redirectUris: string[] = []
		if (client.redirectUris) {
			const redirectUris = client.redirectUris.map((r) => r.value)
		}
		if (client.scopes) {
			client.scopes = JSON.stringify(client.scopes)
		}
		if (client.AuthorizationFlows) {
			client.AuthorizationFlows = JSON.stringify(client.AuthorizationFlows)
		}

		client.secret = secret

		const res = await createClient({ variables: { client, redirectUris } })

		if (res.data && res.data.createClient) {
			setResult({
				client_id: res.data.createClient.client_id,
				secret
			})
		}
	}

	const toggleCustomize = () => {
		setCustomizeClientId(!customizeClientId)
	}

	const [
		createClient,
		{ data: refetchData, loading: loadingCreate, error: createError }
	] = useMutation(CREATE_CLIENT_MUTATION, { refetchQueries: ['ALL_CLIENTS_QUERY'] })

	const { error: scopesError, data: clientScopes, loading: loadingClients } = useQuery(GET_SCOPES_FOR_CLIENT_QUERY)
	const { error: getClientsError, data: allClients, loading: loadingScopes } = useQuery(ALL_CLIENTS_QUERY)

	React.useEffect(() => {
		setError(scopesError ? scopesError : getClientsError ? getClientsError : undefined)
	}, [setError, getClientsError, scopesError])

	React.useEffect(() => {
		setClients(allClients || refetchData)
	}, [setClients, allClients, refetchData])

	return (
		<AuthenticatedRoute permission={Permissions.Admin}>
			{(loadingClients || loadingScopes) && <LoadingIndicator />}
			{(scopesError || getClientsError || createError) && <ErrorMessage />}
			{clients.map((client) => {
				return (
					<div key={client.name} className="container pt-4">
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
													<button type="button" className="btn btn-link btn-sm" onClick={toggleCustomize}>
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
															onChange={(e) => handleClientIdChange(e, apolloClient)}
															required
															readOnly={result !== undefined}
															aria-describedby="clientIdHelpBlock"
															autoFocus
														/>
													)}
												</ApolloConsumer>
											)}
											<div id="clientIdHelpBlock" className="small form-text text-muted">
												We recommend using the generated Client ID but you can customize it as long as the value is
												unique.
											</div>
										</div>
									</div>
									<ClientForm
										client={client}
										onChange={handleClientFormChange}
										onValidated={onClientFormValidated}
										scopes={clientScopes}
										grantTypes={clientScopes.AuthorizationFlows}
									/>
									{result && (
										<div className="alert alert-success">
											<p>
												Success! Your client_id and client_secret that your application will use to authenticate users
												are listed below. Please note these values down as this is the only time the client_secret will
												be visible.
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
								{result && (
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
												disabled={!clientIdValid || !clientFormValid || loadingCreate}>
												<i className="fal fa-save" /> Create
											</button>
										</div>
									</div>
								)}
							</div>
						</form>
					</div>
				)
			})}
		</AuthenticatedRoute>
	)
}

export default ClientAddPage
