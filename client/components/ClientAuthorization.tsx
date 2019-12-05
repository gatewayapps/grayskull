import React, { PureComponent } from 'react'
import { ApolloConsumer } from 'react-apollo'
import gql from 'graphql-tag'
import LoadingIndicator from './LoadingIndicator'

import SignOut from './SignOut'

import UserContext from '../contexts/UserContext'

const AUTHORIZE_CLIENT_MUTATION = gql`
  mutation AUTHORIZE_CLIENT_MUTATION(
    $client_id: String!
    $responseType: String!
    $redirectUri: String!
    $scope: String
    $state: String
    $nonce: String
  ) {
    authorizeClient(
      data: {
        client_id: $client_id
        responseType: $responseType
        redirectUri: $redirectUri
        scope: $scope
        state: $state
        nonce: $nonce
      }
    ) {
      pendingScopes
      redirectUri
    }
  }
`

const UPDATE_CLIENT_SCOPES_MUTATION = gql`
  mutation UPDATE_CLIENT_SCOPES_MUTATION($client_id: String!, $allowedScopes: [String]!, $deniedScopes: [String]!) {
    updateClientScopes(data: { client_id: $client_id, allowedScopes: $allowedScopes, deniedScopes: $deniedScopes })
  }
`

interface IClientAuthorizationState {
  initialized: boolean
  isSaving: boolean
  pendingScopes: any[]
  allowedScopes: any[]
  deniedScopes: any[]
}

class ClientAuthorization extends React.Component<IClientAuthorizationProps, IClientAuthorizationState> {
  state = {
    initialized: false,
    isSaving: false,
    pendingScopes: [],
    allowedScopes: [],
    deniedScopes: []
  }
  apolloClient: any

  componentDidMount() {
    this.authorizeClient()
  }

  handleScopeCheckChanged = (e) => {
    const { name, checked } = e.target
    if (checked) {
      // add to allowed and remove from denied
      this.setState((prevState) => ({
        ...prevState,
        allowedScopes: prevState.allowedScopes.includes(name)
          ? prevState.allowedScopes
          : prevState.allowedScopes.concat([name]),
        deniedScopes: prevState.deniedScopes.filter((denied) => denied !== name)
      }))
    } else {
      // add to denied and remove from allowed
      this.setState((prevState) => ({
        ...prevState,
        allowedScopes: prevState.allowedScopes.filter((allowed) => allowed !== name),
        deniedScopes: prevState.deniedScopes.includes(name)
          ? prevState.deniedScopes
          : prevState.deniedScopes.concat([name])
      }))
    }
  }

  authorizeClient = async () => {
    const { data } = await this.apolloClient.mutate({
      mutation: AUTHORIZE_CLIENT_MUTATION,
      variables: {
        client_id: this.props.client.client_id,
        responseType: this.props.responseType,
        redirectUri: this.props.redirectUri,
        scope: this.props.scope,
        state: this.props.state,
        nonce: this.props.nonce
      }
    })
    if (data && data.authorizeClient) {
      if (data.authorizeClient.redirectUri) {
        window.location.replace(data.authorizeClient.redirectUri)
        return
      }
      if (data.authorizeClient.pendingScopes) {
        this.setState({
          initialized: true,
          allowedScopes: data.authorizeClient.pendingScopes,
          pendingScopes: data.authorizeClient.pendingScopes
        })
      }
    }
  }

  updateClientScopes = async () => {
    const { data } = await this.apolloClient.mutate({
      mutation: UPDATE_CLIENT_SCOPES_MUTATION,
      variables: {
        client_id: this.props.client.client_id,
        allowedScopes: this.state.allowedScopes,
        deniedScopes: this.state.deniedScopes
      }
    })
    if (data && data.updateClientScopes) {
      await this.authorizeClient()
    }
  }

  onDenyClicked = async () => {
    const query = ['error=consent_required']
    if (this.props.state) {
      query.push(`state=${encodeURIComponent(this.props.state)}`)
    }

    window.location.replace(`${this.props.redirectUri}?${query.join('&')}`)
  }

  onSubmit = async (e) => {
    e.preventDefault()
    this.setState({ isSaving: true })
    await this.updateClientScopes()
    this.setState({ isSaving: false })
  }

  render() {
    return (
      <ApolloConsumer>
        {(apolloClient) => {
          this.apolloClient = apolloClient
          if (!this.state.initialized) {
            return <LoadingIndicator />
          }
          return (
            <UserContext.Consumer>
              {({ user }) => (
                <form onSubmit={this.onSubmit}>
                  <div className="card">
                    <div className="card-header">Authorize {this.props.client.name}</div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-lg-3">
                          {this.props.client.logoImageUrl && (
                            <img src={this.props.client.logoImageUrl} style={{ width: '100%' }} />
                          )}
                        </div>
                        <div className="col-lg-9">
                          <div className="mt-2">
                            <strong>{this.props.client.name}</strong> would like to:
                          </div>
                          {this.props.scopes
                            .filter(
                              (s) => this.state.pendingScopes.includes(s.id) && s.permissionLevel <= user.permissions
                            )
                            .map((scope) => (
                              <div key={scope.id} className="form-check my-2 mx-4">
                                <input
                                  type="checkbox"
                                  id={scope.id}
                                  disabled={scope.required}
                                  name={scope.id}
                                  className="form-check-input"
                                  checked={this.state.allowedScopes.includes(scope.id)}
                                  onChange={this.handleScopeCheckChanged}
                                />
                                <label htmlFor={scope.id} className="form-check-label">
                                  {scope.userDescription}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-center mt-2">
                        <div>
                          Logged in as{' '}
                          <strong>
                            {user.firstName} {user.lastName}
                          </strong>{' '}
                          (<SignOut includeState>Not You?</SignOut>)
                        </div>
                      </div>
                    </div>
                    <div className="card-footer clearfix">
                      <div className="btn-toolbar float-right">
                        <button
                          type="button"
                          className="btn btn-outline-danger mr-3"
                          disabled={this.state.isSaving}
                          onClick={this.onDenyClicked}>
                          <i className="fal fa-times fa-fw" /> Deny
                        </button>
                        <button type="submit" className="btn btn-success" disabled={this.state.isSaving}>
                          <i className="fal fa-check fa-fw" /> Authorize
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </UserContext.Consumer>
          )
        }}
      </ApolloConsumer>
    )
  }
}

export interface IClientAuthorizationProps {
  client: {
    client_id: string
    name: string
    logoImageUrl: string
  }
  responseType: string
  redirectUri: string
  scope: string
  scopes: [{ id: string; userDescription: string; permissionLevel: number; required: boolean }]
  state?: string
  nonce?: string
}

export default ClientAuthorization