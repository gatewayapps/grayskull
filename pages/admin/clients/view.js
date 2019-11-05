import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'
import AuthenticatedRoute from '../../../client/layouts/authenticatedRoute'
import Permissions from '../../../client/utils/permissions'
import LoadingIndicator from '../../../client/components/LoadingIndicator'
import ErrorMessage from '../../../client/components/ErrorMessage'

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

class ClientView extends PureComponent {
  static getInitialProps({ query }) {
    return { query }
  }

  render() {
    return (
      <AuthenticatedRoute permission={Permissions.ADMIN}>
        <div className="container pt-4">
          <Query query={SINGLE_CLIENT_QUERY} variables={{ client_id: this.props.query.id }}>
            {({ data, error, loading }) => {
              if (loading) return <LoadingIndicator />
              if (error) return <ErrorMessage error={error} />
              if (!data || !data.client) {
                return <p>Client not found</p>
              }
              const { client, scopes } = data

              const clientScopes = JSON.parse(client.scopes)

              return (
                <div className="card">
                  <img className="card-img-top" src={client.logoImageUrl} alt={client.name} />
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
              )
            }}
          </Query>
        </div>
      </AuthenticatedRoute>
    )
  }
}

ClientView.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}

export default ClientView
