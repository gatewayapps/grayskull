import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'
import Primary from '../../layouts/primary'
import LoadingIndicator from '../../components/LoadingIndicator'
import ErrorMessage from '../../components/ErrorMessage'

const SINGLE_CLIENT_QUERY = gql`
  query SINGLE_CLIENT_QUERY($client_id: Int!) {
    client(where: { client_id: $client_id }) {
      client_id
      name
      logoImageUrl
      public
      description
      url
      redirectUri
    }
  }
`

class ClientView extends PureComponent {
  static getInitialProps({ query }) {
    return { query }
  }

  render() {
    console.log(this.props)
    return (
      <Primary>
        <div className="container pt-4">
          <Query query={SINGLE_CLIENT_QUERY} variables={{ client_id: parseInt(this.props.query.id, 10) }}>
            {({ data, error, loading }) => {
              if (loading) return <LoadingIndicator />
              if (error) return <ErrorMessage error={error} />
              if (!data || !data.client) {
                return <p>Client not found</p>
              }
              const { client } = data
              return (
                <div className="card">
                  <img className="card-img-top" src={client.logoImageUrl} alt={client.name} />
                  <div className="card-body">
                    <h3 className="card-title">{client.name}</h3>
                    <p>{client.description}</p>
                    <p>Url: {client.url}</p>
                    <p>Redirect Uri: {client.redirectUri}</p>
                  </div>
                </div>
              )
            }}
          </Query>
        </div>
      </Primary>
    )
  }
}

ClientView.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}

export default ClientView
