import gql from 'graphql-tag'
import debounce from 'lodash/debounce'
import Link from 'next/link'
import React, { PureComponent } from 'react'
import { ApolloConsumer, Mutation } from 'react-apollo'
import uuid from 'uuid/v4'
import ErrorMessage from '../../../components/ErrorMessage'
import Primary from '../../../layouts/primary'
import generateSecret from '../../../utils/generateSecret'
import { ALL_CLIENTS_QUERY } from './index'

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
      isActive: true
    },
    clientIdValid: true,
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
      fetchPolicy: 'network-only',
    })
    console.log(data)
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

  addRedirectUri = () => {
    this.setState((prevState) => ({
      ...prevState,
      client: {
        ...prevState.client,
        redirectUris: prevState.client.redirectUris.concat({ key: uuid(), value: '' })
      }
    }))
  }

  removeRedirectUri = (key) => {
    this.setState((prevState) => ({
      ...prevState,
      client: {
        ...prevState.client,
        redirectUris: prevState.client.redirectUris.length === 1 ? prevState.client.redirectUris : prevState.client.redirectUris.filter((r) => r.key !== key)
      }
    }))
  }

  handleRedirectUriChange = (key, value) => {
    this.setState((prevState) => ({
      ...prevState,
      client: {
        ...prevState.client,
        redirectUris: prevState.client.redirectUris.map((r) => {
          if (r.key === key) {
            r.value = value
          }
          return r
        })
      }
    }))
  }

  handleChange = (evt) => {
    const { name, value } = evt.target

    const finalValue = evt.target.type === 'checkbox' ? evt.target.checked : value
    this.setState((prevState) => ({
      ...prevState,
      client: {
        ...prevState.client,
        [name]: finalValue
      }
    }))
  }

  submitClient = async (evt, createClient) => {
    evt.preventDefault()
    const secret = generateSecret()
    const data = {
      ...this.state.client,
      redirectUris: JSON.stringify(this.state.client.redirectUris.map((r) => r.value)),
      secret
    }
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

  render() {
    return (
      <Mutation mutation={CREATE_CLIENT_MUTATION} refetchQueries={[{ query: ALL_CLIENTS_QUERY }]}>
        {(createClient, { error, loading }) => (
          <Primary>
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
                              aria-describedby='clientIdHelpBlock'
                            />
                          )}
                        </ApolloConsumer>
                        <div id="clientIdHelpBlock" className="small form-text text-muted">
                          We recommend using the generated GUID but you can customize the Client ID if you want as long as the value is unique.
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="name">
                        Name
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={this.state.client.name}
                          onChange={this.handleChange}
                          required
                          readOnly={this.state.result !== undefined}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="logoImageUrl">
                        Logo Image Url
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input
                          type="url"
                          className="form-control"
                          name="logoImageUrl"
                          value={this.state.client.logoImageUrl}
                          onChange={this.handleChange}
                          required
                          readOnly={this.state.result !== undefined}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="url">
                        Base Url
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input
                          type="url"
                          className="form-control"
                          name="baseUrl"
                          value={this.state.client.baseUrl}
                          onChange={this.handleChange}
                          required
                          readOnly={this.state.result !== undefined}
                          aria-describedby='baseUrlHelpBlock'
                        />
                        <div id="baseUrlHelpBlock" className="small form-text text-muted">
                          The base url for the client application
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="url">
                        Home Page Url
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input
                          type="url"
                          className="form-control"
                          name="homePageUrl"
                          value={this.state.client.homePageUrl}
                          onChange={this.handleChange}
                          readOnly={this.state.result !== undefined}
                          aria-describedby='homePageUrlHelpBlock'
                        />
                        <div id="homePageUrlHelpBlock" className="small form-text text-muted">
                          The url for the home page of the client application. You can leave this blank if the home page is the same as the Base Url.
                      </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="redirectUri">
                        Redirect URI(s)
                      </label>
                      <div className="col-sm-12 col-md-9">
                        {this.state.client.redirectUris.map((redirectUri) => (
                          <div key={redirectUri.key} className='input-group mb-2'>
                            <input
                              type='url'
                              className='form-control'
                              name={`redirectUris-${redirectUri.key}`}
                              onChange={(e) => this.handleRedirectUriChange(redirectUri.key, e.target.value)}
                              required
                              readOnly={this.state.result !== undefined}
                              value={redirectUri.value}
                            />
                            <div className='input-group-append'>
                              <button className='btn btn-outline-danger' type='button' onClick={() => this.removeRedirectUri(redirectUri.key)}>
                                <i className='fal fa-fw fa-trash' />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className='btn btn-link btn-sm' onClick={this.addRedirectUri} type='button'>
                          Add another redirect uri
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="description">
                        Description
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <textarea
                          className="form-control"
                          name="description"
                          value={this.state.client.description}
                          onChange={this.handleChange}
                          readOnly={this.state.result !== undefined}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="public"
                          name="public"
                          value={this.state.client.public}
                          onChange={this.handleChange}
                          readOnly={this.state.result !== undefined}
                        />
                        <label className="form-check-label" htmlFor="public">
                          Publicly visible
                        </label>
                      </div>
                    </div>

                    {this.state.result && (
                      <div className="alert alert-success">
                        <p>
                          Success! Your client_id and client_secret that your application will use to authenticate users are listed below. Please note these values down as this is
                          the only time the client_secret will be visible.
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
                        <button className="btn btn-success" type="submit" disabled={loading}>
                          <i className="fal fa-save" /> Create
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </Primary>
        )}
      </Mutation>
    )
  }
}

export default ClientAddPage
