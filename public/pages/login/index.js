import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import ErrorMessage from '../../components/ErrorMessage'
import LoadingIndicator from '../../components/LoadingIndicator'
import Primary from '../../layouts/primary'
import generateFingerprint from '../../utils/generateFingerprint'

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
  state = {
    fingerprint: ''
  }

  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  async componentDidMount() {
    const fingerprint = await generateFingerprint()
    this.setState({ fingerprint })
  }

  renderLoginBody(client) {
    const { props } = this
    return (
      <div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1 }} />
          <div className="container">
            <div className="row">
              <div className="col col-md-8 offset-md-2">
                <form noValidate method="post" className="form">
                  <input type="hidden" name="sessionId" value={this.state.fingerprint} required />
                  <div className="card">
                    <div className="card-header">Login to {client.name}</div>
                    <div className="card-body">
                      {props.message && <div className="alert alert-info">{props.message}</div>}
                      {props.error && <div className="alert alert-danger">{props.error.message}</div>}
                      <div className="row">
                        <div className="col-3">{client.logoImageUrl && <img src={client.logoImageUrl} style={{ width: '100%' }} />}</div>
                        <div className="col-9">
                          <div className="form-group">
                            <label htmlFor="name">E-mail Address: </label>
                            <input type="email" className="form-control" name="emailAddress" />
                          </div>
                          <div className="form-group">
                            <label htmlFor="password">Password: </label>
                            <input type="password" className="form-control" name="password" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div className="btn-toolbar float-left">
                        <a href="/resetPassword" className="btn btn-link">
                          Forgot Password
                        </a>
                      </div>

                      <div className="btn-toolbar float-right">
                        <button className="btn btn-outline-info" type="submit">
                          <i className="fal fa-sign-in" /> Login
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }} />
        </div>
      </div>
    )
  }

  render() {
    const { props } = this

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
              return this.renderLoginBody(data.client)
            }
          }}
        </Query>
      </Primary>
    )
  }
}

export default Login
