import gql from 'graphql-tag'
import Link from 'next/link'
import React from 'react'
import { Query } from 'react-apollo'
import Primary from '../../../client/layouts/primary'
import ErrorMessage from '../../../client/components/ErrorMessage'
import LoadingIndicator from '../../../client/components/LoadingIndicator'
import AuthenticatedRoute from '../../../client/layouts/authenticatedRoute'
import Permissions from '../../../client/utils/permissions'
import { RequirePermission, RequirePermissionModes } from '../../../client/components/RequirePermission'

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

const ClientsIndexPage = () => {
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
        <Query query={ALL_CLIENTS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <LoadingIndicator />
            if (error) return <ErrorMessage error={error} />
            if (!data || !data.clients) {
              return <p>No Clients found</p>
            }
            return (
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
            )
          }}
        </Query>
      </div>
    </AuthenticatedRoute>
  )
}

export default ClientsIndexPage
export { ALL_CLIENTS_QUERY }
