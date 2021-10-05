/* eslint-disable @typescript-eslint/camelcase */
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React from 'react'
import { useQuery } from 'react-apollo'
import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'
import ErrorMessage from '../../../presentation/components/ErrorMessage'
import { IClient, IScope } from '../../../foundation/types/types'

const SINGLE_CLIENT_QUERY = gql`
	query SINGLE_CLIENT_QUERY($client_id: String!) {
		scopes {
			id
			clientDescription
		}

		client(where: { client_id: $client_id }) {
			client_id
			name
			logoImageUrl
			public
			description
			baseUrl
			homePageUrl
			redirectUris
			scopes
		}
	}
`

const ClientView = (props) => {
	const { data, error, loading } = useQuery(SINGLE_CLIENT_QUERY, { variables: { client_id: props.query.id } })
	const [scopes, setScopes] = React.useState<IScope[]>([])
	const [client, setClient] = React.useState<IClient>()
	const [clientScopes, setClientScopes] = React.useState<string[]>([])
	React.useEffect(() => {
		if (data) {
			const { client, scopes } = data
			setScopes(scopes)
			setClient(client)
			setClientScopes(JSON.parse(client.scopes))
		}
	}, [setScopes, setClient, setClientScopes, data])

	return (
		<AuthenticatedRoute permission={Permissions.ADMIN}>
			<div className="container pt-4">
				{loading && <LoadingIndicator />}
				{error && <ErrorMessage error={error} />}
				{!data || (!data.client && <p>Client not found</p>)}
				{data && client && scopes && (
					<div className="card">
						<img className="card-img-top" src={client.logoImageUrl!} alt={client.name} />
						<div className="card-body">
							<h3 className="card-title">{client.name}</h3>
							<p>{client.description}</p>
							<p>Base Url: {client.baseUrl}</p>
							<p>Home Page Url: {client.homePageUrl || client.baseUrl}</p>
							<p>Redirect Uri: {JSON.parse(client.redirectUris).join(', ')}</p>
							<div>
								Scopes:
								<ul>
									{scopes.map((scope) => {
										if (clientScopes.includes(scope.id)) {
											return <li key={scope.id}>{scope.clientDescription}</li>
										} else {
											return null
										}
									})}
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
		</AuthenticatedRoute>
	)
}

ClientView.getInitialProps = async ({ query }) => {
	return { query }
}

ClientView.propTypes = {
	query: PropTypes.shape({
		id: PropTypes.string.isRequired
	}).isRequired
}

export default ClientView
