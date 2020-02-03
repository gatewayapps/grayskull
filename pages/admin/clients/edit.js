/* eslint-disable @typescript-eslint/camelcase */
import gql from 'graphql-tag'
import Link from 'next/link'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Mutation, Query } from 'react-apollo'
import uuid from 'uuid/v4'
import ClientForm from '../../../presentation/components/ClientForm'
import ErrorMessage from '../../../presentation/components/ErrorMessage'
import LoadingIndicator from '../../../presentation/components/LoadingIndicator'

import { ALL_CLIENTS_QUERY } from './index'

import AuthenticatedRoute from '../../../presentation/layouts/authenticatedRoute'
import Permissions from '../../../presentation/utils/permissions'

const UPDATE_CLIENT_QUERY = gql`
  query UPDATE_CLIENT_QUERY($client_id: String!) {
    client(where: { client_id: $client_id }) {
      client_id
      name
      logoImageUrl
      baseUrl
      homePageUrl
      redirectUris
      description
      scopes
      public
      pinToHeader
    }

    scopes {
      id
      clientDescription
      required
    }
  }
`

const UPDATE_CLIENT_MUTATION = gql`
  mutation UPDATE_CLIENT_MUTATION($data: UpdateClientArgs!) {
    updateClient(data: $data) {
      client_id
      name
      logoImageUrl
      baseUrl
      homePageUrl
      redirectUris
      description
      scopes
      public
      pinToHeader
    }
  }
`

class ClientEditPage extends PureComponent {
  static getInitialProps({ query }) {
    return { query }
  }

  state = {
    client: {},
    clientFormValid: false,
    result: undefined
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

  onClientFormValidated = (isValid) => {
    this.setState({ clientFormValid: isValid })
  }

  submitClient = async (evt, clientId, updateClient) => {
    evt.preventDefault()

    if (!this.state.clientFormValid) {
      return
    }

    this.setState({ results: undefined })

    const { redirectUris, scopes, ...data } = this.state.client

    data.client_id = clientId

    if (redirectUris) {
      data.redirectUris = JSON.stringify(redirectUris.map((r) => r.value))
    }
    if (scopes) {
      data.scopes = JSON.stringify(scopes)
    }

    const res = await updateClient({ variables: { data } })

    if (res.data && res.data.updateClient) {
      this.setState({
        results: {
          client_id: res.data.updateClient.client_id
        }
      })
    }
  }

  render() {
    return (
      <AuthenticatedRoute permission={Permissions.ADMIN}>
        <Query query={UPDATE_CLIENT_QUERY} variables={{ client_id: this.props.query.id }}>
          {({ data, error, loading: loadingClient }) => {
            if (loadingClient) {
              return <LoadingIndicator />
            }

            if (error) {
              return <ErrorMessage error={error} />
            }

            const { client, scopes } = data

            const parsedClient = {
              ...client,
              redirectUris: JSON.parse(client.redirectUris).map((r) => ({ key: uuid(), value: r })),
              scopes: JSON.parse(client.scopes)
            }

            const mergedClient = {
              ...parsedClient,
              ...this.state.client
            }

            return (
              <Mutation mutation={UPDATE_CLIENT_MUTATION} refetchQueries={[{ query: ALL_CLIENTS_QUERY }]}>
                {(updateClient, { error: updateError, loading: saving }) => (
                  <div className="container pt-4">
                    <form onSubmit={(e) => this.submitClient(e, mergedClient.client_id, updateClient)}>
                      <div className="card">
                        <div className="card-header">Update Client</div>
                        <div className="card-body">
                          <ErrorMessage error={updateError} />
                          <div className="form-group row">
                            <label className="col-sm-12 col-md-3 col-form-label" htmlFor="client_id">
                              Client ID
                            </label>
                            <div className="col-sm-12 col-md-9">
                              <span className="py-2" style={{ verticalAlign: 'middle' }}>
                                {mergedClient.client_id}
                              </span>
                            </div>
                          </div>
                          <ClientForm
                            client={mergedClient}
                            onChange={this.handleClientFormChange}
                            onValidated={this.onClientFormValidated}
                            scopes={scopes}
                          />
                          {this.state.result && <div className="alert alert-success">Success!</div>}
                        </div>
                        <div className="card-footer justify-content-end">
                          <div className="btn-toolbar">
                            <Link href="/admin/clients">
                              <a className="btn btn-outline-secondary mr-3">
                                <i className="fal fa-fw fa-times" /> Cancel
                              </a>
                            </Link>
                            <button
                              className="btn btn-success"
                              type="submit"
                              disabled={saving || !this.state.clientFormValid}>
                              <i className="fal fa-fw fa-save" /> Update
                            </button>
                          </div>
                        </div>
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

ClientEditPage.propTypes = {
  query: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}

export default ClientEditPage
