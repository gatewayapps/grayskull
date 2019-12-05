import gql from 'graphql-tag'
import debounce from 'lodash/debounce'
import Link from 'next/link'
import React, { PureComponent } from 'react'
import { ApolloConsumer, Mutation, Query } from 'react-apollo'
import uuid from 'uuid/v4'
import ErrorMessage from '../../../client/components/ErrorMessage'

import generateSecret from '../../../client/utils/generateSecret'
import { ALL_CLIENTS_QUERY } from './index'
import LoadingIndicator from '../../../client/components/LoadingIndicator'
import ClientForm from '../../../client/components/ClientForm'

import AuthenticatedRoute from '../../../client/layouts/authenticatedRoute'
import Permissions from '../../../client/utils/permissions'

const CREATE_CLIENT_MUTATION = gql`
  mutation CREATE_CLIENT_MUTATION($data: CreateClientArgs!) {
    createClient(data: $data) {
      client_id
    }
  }
`

const CHECK_CLIENT_ID_QUERY = gql`
  query CHECK_CLIENT_ID_QUERY($client_id: String!) {
    client(where: { client_id: $client_id }) {
      client_id
    }
  }
`

const GET_SCOPES_FOR_CLIENT_QUERY = gql`
  query GET_SCOPES_FOR_CLIENT_QUERY {
    scopes {
      id
      clientDescription
      required
    }
  }
`

class ClientAddPage extends PureComponent {
  state = {
    client: {
      client_id: uuid(),
      name: '',
      logoImageUrl: '',
      description: '',
      baseUrl: '',
      homePageUrl: '',
      public: true,
      redirectUris: [{ key: uuid(), value: '' }],
      scopes: [],
      isActive: true
    },
    customizeClientId: false,
    clientIdValid: true,
    clientFormValid: false,
    result: undefined
  }

  checkClientId = debounce(async (apolloClient) => {
    if (!this.state.client.client_id) {
      this.setState({ clientIdValid: false })
      return
    }
    const { data } = await apolloClient.query({
      query: CHECK_CLIENT_ID_QUERY,
      variables: { client_id: this.state.client.client_id },
      fetchPolicy: 'network-only'
    })
    if (data && data.client) {
      this.setState({ clientIdValid: false })
    } else {
      this.setState({ clientIdValid: true })
    }
  }, 300)

  handleClientIdChange = (evt, apolloClient) => {
    this.handleChange(evt)
    this.checkClientId(apolloClient)
  }

  handleClientFormChange = (name, value) => {
    this.setState((prevState) => ({
      ...prevState,
      client: {
        ...prevState.client,
        [name]: value
      }
    }))
  }

  handleChange = (evt) => {
    const { name, value } = evt.target

    this.setState((prevState) => ({
      ...prevState,
      client: {
        ...prevState.client,
        [name]: value
      }
    }))
  }

  onClientFormValidated = (isValid) => {
    this.setState({ clientFormValid: isValid })
  }

  submitClient = async (evt, createClient) => {
    evt.preventDefault()
    if (!this.state.clientIdValid || !this.state.clientFormValid) {
      return
    }
    const secret = generateSecret()

    const { redirectUris, scopes, ...data } = this.state.client

    if (redirectUris) {
      data.redirectUris = JSON.stringify(redirectUris.map((r) => r.value))
    }
    if (scopes) {
      data.scopes = JSON.stringify(scopes)
    }

    data.secret = secret

    const res = await createClient({ variables: { data } })

    if (res.data && res.data.createClient) {
      this.setState({
        result: {
          client_id: res.data.createClient.client_id,
          secret
        }
      })
    }
  }

  toggleCustomize = () => {
    this.setState((prevState) => ({
      ...prevState,
      customizeClientId: !prevState.customizeClientId
    }))
  }

  render() {
    return (
      <AuthenticatedRoute permission={Permissions.ADMIN}>
        <Query query={GET_SCOPES_FOR_CLIENT_QUERY}>
          {({ data, error, loading: loadingScopes }) => {
            if (loadingScopes) {
              return <LoadingIndicator />
            }

            if (error) {
              return <ErrorMessage error={error} />
            }

            return (
              <Mutation mutation={CREATE_CLIENT_MUTATION} refetchQueries={[{ query: ALL_CLIENTS_QUERY }]}>
                {(createClient, { error, loading }) => (
                  <div className="container pt-4">
                    <form onSubmit={(e) => this.submitClient(e, createClient)}>
                      <div className="card">
                        <div className="card-header">Create Client</div>
                        <div className="card-body">
                          <ErrorMessage error={error} />
                          <div className="form-group row">
                            <label className="col-sm-12 col-md-3 col-form-label" htmlFor="client_id">
                              Client ID
                            </label>
                            <div className="col-sm-12 col-md-9">
                              {!this.state.customizeClientId && (
                                <>
                                  <span className="py-2" style={{ verticalAlign: 'middle' }}>
                                    {this.state.client.client_id}
                                  </span>
                                  <button type="button" className="btn btn-link btn-sm" onClick={this.toggleCustomize}>
                                    Customize
                                  </button>
                                </>
                              )}
                              {this.state.customizeClientId && (
                                <ApolloConsumer>
                                  {(apolloClient) => (
                                    <input
                                      type="text"
                                      className={`form-control ${this.state.clientIdValid ? 'is-valid' : 'is-invalid'}`}
                                      name="client_id"
                                      value={this.state.client.client_id}
                                      onChange={(e) => this.handleClientIdChange(e, apolloClient)}
                                      required
                                      readOnly={this.state.result !== undefined}
                                      aria-describedby="clientIdHelpBlock"
                                      autoFocus
                                    />
                                  )}
                                </ApolloConsumer>
                              )}
                              <div id="clientIdHelpBlock" className="small form-text text-muted">
                                We recommend using the generated Client ID but you can customize it as long as the value
                                is unique.
                              </div>
                            </div>
                          </div>
                          <ClientForm
                            client={this.state.client}
                            onChange={this.handleClientFormChange}
                            onValidated={this.onClientFormValidated}
                            scopes={data.scopes}
                          />
                          {this.state.result && (
                            <div className="alert alert-success">
                              <p>
                                Success! Your client_id and client_secret that your application will use to authenticate
                                users are listed below. Please note these values down as this is the only time the
                                client_secret will be visible.
                              </p>
                              <div>
                                <strong>Client Id:</strong> {this.state.result.client_id}
                              </div>
                              <div>
                                <strong>Secret:</strong> {this.state.result.secret}
                              </div>
                            </div>
                          )}
                        </div>
                        {!this.state.result && (
                          <div className="card-footer clearfix">
                            <div className="btn-toolbar float-right">
                              <Link href="/admin/clients">
                                <a className="btn btn-outline-secondary mr-3">
                                  <i className="fal fa-times" /> Cancel
                                </a>
                              </Link>
                              <button
                                className="btn btn-success"
                                type="submit"
                                disabled={loading || !this.state.clientIdValid || !this.state.clientFormValid}>
                                <i className="fal fa-save" /> Create
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                )}
              </Mutation>
            )
          }}
        </Query>
      </AuthenticatedRoute>
    )
  }
}

export default ClientAddPage
