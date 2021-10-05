import gql from 'graphql-tag'
import Link from 'next/link'
import React from 'react'
import { useQuery } from 'react-apollo'

import ErrorMessage from '../../../presentation/components/ErrorMessage'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'
import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'
import { RequirePermission, RequirePermissionModes } from '../../../presentation/components/RequirePermission'
import { IClient } from '../../../foundation/types/types'

const ALL_CLIENTS_QUERY = gql`
	query ALL_CLIENTS_QUERY {
		clients {
			client_id
			name
			baseUrl
			homePageUrl
		}
	}
`

const ClientsIndexPage: React.FC = () => {
	const { data, error, loading } = useQuery<{ clients: IClient[] }>(ALL_CLIENTS_QUERY)

	return (
		<AuthenticatedRoute permission={Permissions.ADMIN}>
			<div className="container pt-4">
				<div className="row mb-2">
					<div className="col">
						<h1>Clients</h1>
					</div>
					<div className="col-auto">
						<RequirePermission mode={RequirePermissionModes.SHOW_ERROR} permission={Permissions.ADMIN}>
							<Link href="/admin/clients/add">
								<a className="btn btn-outline-success">
									<i className="fal fa-plus" /> Add Client
								</a>
							</Link>
						</RequirePermission>
					</div>
				</div>
				{loading && <LoadingIndicator />}
				{error && <ErrorMessage error={error} />}
				{!data || (!data.clients && <p>No Clients found</p>)}
				{data && (
					<table className="table table-hover">
						<thead>
							<tr>
								<th>Name</th>
								<th>Url</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{data.clients.map((client) => (
								<tr key={client.client_id}>
									<td>{client.name}</td>
									<td>
										<a href={client.homePageUrl || client.baseUrl}>{client.homePageUrl || client.baseUrl}</a>
									</td>
									<td>
										<Link href={{ pathname: '/admin/clients/edit', query: { id: client.client_id } }}>
											<a className="mr-3">Edit</a>
										</Link>
										<Link href={{ pathname: '/admin/clients/view', query: { id: client.client_id } }}>
											<a>View</a>
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</AuthenticatedRoute>
	)
}

export default ClientsIndexPage
export { ALL_CLIENTS_QUERY }
