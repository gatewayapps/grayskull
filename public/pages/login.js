import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'
import ErrorMessage from '../components/ErrorMessage'
import LoadingIndicator from '../components/LoadingIndicator'
import LoginForm from '../components/LoginForm'
import Primary from '../layouts/primary'
import { parseRoutingState } from '../utils/routing'

const GET_CLIENT_QUERY = gql`
  query GET_CLIENT($client_id: String!) {
    client(where: { client_id: $client_id }) {
      client_id
      name
      logoImageUrl
    }
  }
`

class LoginPage extends React.PureComponent {
  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  onAuthenticated = () => {
    if (this.props.router.query.state) {
      const parsedState = parseRoutingState(this.props.router.query.state)
      if (parsedState) {
        this.props.router.push(parsedState)
        return
      }
    }
    this.props.router.push('/home')
  }

  render() {
    return (
      <Primary>
        <Query fetchPolicy='' query={GET_CLIENT_QUERY} variables={{ client_id: this.props.query.client_id || 'grayskull' }}>
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
                  <div className='container'>
                    <div className='row'>
                      <div className='col col-md-8 offset-md-2'>
                        <LoginForm
                          client={data.client}
                          onAuthenticated={this.onAuthenticated}
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

export default withRouter(LoginPage)
