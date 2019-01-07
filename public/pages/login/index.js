import React from 'react'
import { Mutation, Query } from 'react-apollo'
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

const LOGIN_MUTATION = gql`
  mutation LOGIN_MUTATION (
    $emailAddress: String!,
    $password: String!,
    $otpToken: String,
    $sessionId: String!,
    $client_id: Int!
    $response_type: String!
    $redirect_uri: String!
    $state: String
  ) {
    login(data: {
      emailAddress: $emailAddress,
      password: $password,
      otpToken: $otpToken,
      sessionId: $sessionId,
      client_id: $client_id,
      response_type: $response_type,
      redirect_uri: $redirect_uri,
      state: $state
    }) {
      success
      message
      otpRequired
      redirectUrl
    }
  }
`

class Login extends React.PureComponent {
  state = {
    emailAddress: '',
    password: '',
    otpToken: '',
    sessionId: '',
    otpRequired: false,
    message: undefined,
  }

  static async getInitialProps({ req, query, res }) {
    const locals = res ? res.locals : {}
    return { query, ...locals }
  }

  async componentDidMount() {
    const sessionId = await generateFingerprint()
    this.setState({ sessionId })
  }

  attemptLogin = async (login) => {
    const variables = {
      emailAddress: this.state.emailAddress,
      password: this.state.password,
      otpToken: this.state.otpToken,
      sessionId: this.state.sessionId,
      client_id: parseInt(this.props.query.client_id, 0),
      response_type: this.props.query.response_type,
      redirect_uri: this.props.query.redirect_uri,
      state: this.props.query.state
    }

    const { data } = await login({ variables })
    if (data && data.login) {
      if (data.login.success === true) {
        window.location.replace(data.login.redirectUrl)
      } else if (data.login.otpRequired === true) {
        this.setState({ otpRequired: true, message: data.login.message })
      } else {
        this.setState({ message: data.login.message })
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  renderLoginBody = (client) => {
    const { props } = this
    return (
      <Mutation mutation={LOGIN_MUTATION}>
        {(login) => (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }} />
            <div className="container">
              <div className="row">
                <div className="col col-md-8 offset-md-2">
                  <input type="hidden" name="sessionId" value={this.state.fingerprint} required />
                  <div className="card">
                    <div className="card-header">Login to {client.name}</div>
                    <div className="card-body">
                      {this.state.message && <div className="alert alert-info">{this.state.message}</div>}
                      {props.error && <div className="alert alert-danger">{props.error.message}</div>}
                      <div className="row">
                        <div className="col-3">{client.logoImageUrl && <img src={client.logoImageUrl} style={{ width: '100%' }} />}</div>
                        <div className="col-9">
                          {!this.state.otpRequired && (
                            <>
                              <div className="form-group">
                                <label htmlFor="name">E-mail Address:</label>
                                <input
                                  type="email"
                                  className="form-control"
                                  name="emailAddress"
                                  value={this.state.emailAddress}
                                  onChange={this.handleChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  value={this.state.password}
                                  onChange={this.handleChange}
                                />
                              </div>
                            </>
                          )}
                          {this.state.otpRequired && (
                            <div className="form-group">
                              <label htmlFor="otpToken">Multi-Factor Authentication Code:</label>
                              <input
                                type="text"
                                className="form-control"
                                name="otpToken"
                                value={this.state.otpToken}
                                onChange={this.handleChange}
                              />
                            </div>
                          )}
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
                        <button
                          className="btn btn-outline-info"
                          onClick={() => this.attemptLogin(login)}>
                          <i className="fal fa-sign-in" /> Login
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ flex: 1 }} />
          </div>

        )}
      </Mutation>
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
