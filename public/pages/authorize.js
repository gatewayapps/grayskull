import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import React, { PureComponent } from 'react'
import { Query } from 'react-apollo'
import Primary from '../layouts/primary'
import ClientAuthorization from '../components/ClientAuthorization'
import LoadingIndicator from '../components/LoadingIndicator'
import RequireAuthentication from '../components/RequireAuthentication'

const LOAD_AUTHORIZE_QUERY = gql`
  query LOAD_AUTHORIZE_QUERY($client_id: String!) {
    client(where: { client_id: $client_id }) {
      client_id
      name
      logoImageUrl
    }

    scopes {
      id
      required
      userDescription
      permissionLevel
    }
  }
`

class AuthorizePage extends PureComponent {
  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  render() {
    return (
      <RequireAuthentication>
        <Primary>
          <Query query={LOAD_AUTHORIZE_QUERY} variables={{ client_id: this.props.router.query.client_id }}>
            {({ data, loading }) => {
              if (loading) {
                return <LoadingIndicator />
              }
              if (!data || !data.client) {
                return <div>Client not found</div>
              }
              return (
                <div style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
                  <div className="container">
                    <div className="row">
                      <div className="col col-md-8 offset-md-2">
                        <ClientAuthorization
                          client={data.client}
                          responseType={this.props.router.query.response_type}
                          redirectUri={this.props.router.query.redirect_uri}
                          scope={this.props.router.query.scope}
                          scopes={data.scopes}
                          state={this.props.router.query.state}
                          nonce={this.props.router.query.nonce}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            }}
          </Query>
        </Primary>
      </RequireAuthentication>
    )
  }
}

AuthorizePage.propTypes = {}

export default withRouter(AuthorizePage)
