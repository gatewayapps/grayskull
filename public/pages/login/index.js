import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from '../../components/ErrorMessage'
import LoadingIndicator from '../../components/LoadingIndicator'
import LoginForm from '../../components/LoginForm'
import Primary from '../../layouts/primary'

const GET_CLIENT_QUERY = gql`
  query GET_CLIENT($client_id: Int!) {
    client(where: { client_id: $client_id }) {
      client_id
      name
      logoImageUrl
    }
  }
`

class Login extends React.PureComponent {
  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  render() {
    return (
      <Primary>
        <Query fetchPolicy="" query={GET_CLIENT_QUERY} variables={{ client_id: parseInt(this.props.query.client_id) }}>
          {({ loading, error, data }) => {
            if (loading) {
              return <LoadingIndicator />
            } else if (error) {
              return <ErrorMessage error={error} />
            } else if (!data || !data.client) {
              return <div>No client found</div>
            } else {
              return (
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1 }} />
                  <div className="container">
                    <div className="row">
                      <div className="col col-md-8 offset-md-2">
                        <LoginForm
                          client={data.client}
                          responseType={this.props.query.response_type}
                          redirectUri={this.props.query.redirect_uri}
                          state={this.props.query.state}
                        />
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }} />
                </div>
              )
            }
          }}
        </Query>
      </Primary>
    )
  }
}

export default Login
