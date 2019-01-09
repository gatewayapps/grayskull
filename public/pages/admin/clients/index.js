import gql from 'graphql-tag'
import Link from 'next/link'
import React from 'react'
import { Query } from 'react-apollo'
import Primary from '../../../layouts/primary'
import ErrorMessage from '../../../components/ErrorMessage'
import LoadingIndicator from '../../../components/LoadingIndicator'

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
    <Primary>
      <div className="container pt-4">
        <div className="row">
          <div className="col">
            <h1>Clients</h1>
          </div>
          <div className="col-auto">
            <Link href="/admin/clients/add">
              <a className="btn btn-outline-primary">
                <i className="fal fa-plus" /> Add Client
              </a>
            </Link>
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
    </Primary>
  )
}

export default ClientsIndexPage
export { ALL_CLIENTS_QUERY }
