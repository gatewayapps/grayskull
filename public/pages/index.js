import React from 'react'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Primary from '../layouts/primary'
import LoadingIndicator from '../components/LoadingIndicator'
import Link from 'next/link'
const ALL_CLIENTS_QUERY = gql`
  query ALL_CLIENTS_QUERY {
    clients {
      client_id
      name
      homePageUrl
      logoImageUrl
      redirectUri
    }
  }
`

const index = () => {
  return (
    <Primary>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: 'url(/static/bg.jpg)' }}>
        <div className="container d-flex h-100" style={{ overflow: 'auto' }}>
          <div className="justify-content-center align-self-center w-100" style={{ maxHeight: '100%' }}>
            <h4 className="display-4 text-center w-100 mb-5" style={{ fontSize: '8vmin' }}>
              Select a client to login
            </h4>
            <div className="row justify-content-center ">
              <Query query={ALL_CLIENTS_QUERY}>
                {({ data, error, loading }) => {
                  if (loading) return <LoadingIndicator />
                  if (error) return <ErrorMessage error={error} />
                  if (!data || !data.clients) {
                    return <p>No Clients found</p>
                  }
                  return data.clients.map((client) => {
                    return (
                      <div style={{ cursor: 'pointer' }} key={client.client_id} className="col-6 col-md-3">
                        <Link href={client.homePageUrl}>
                          <div className="card">
                            <div className="card-body">
                              <img src={client.logoImageUrl} className="img-fluid w-100" />
                              <div className="w-100 text-center">{client.name}</div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    )
                  })
                }}
              </Query>
            </div>
          </div>
        </div>
      </div>
    </Primary>
  )
}

export default index
