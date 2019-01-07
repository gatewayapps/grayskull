import gql from 'graphql-tag'
import Link from 'next/link'
import Router from 'next/router'
import React, { PureComponent } from 'react'
import { Mutation } from 'react-apollo'
import ErrorMessage from '../../components/ErrorMessage'
import Primary from '../../layouts/primary'
import generateSecret from '../../utils/generateSecret'
import { ALL_CLIENTS_QUERY } from './index'

const CREATE_CLIENT_MUTATION = gql`
  mutation CREATE_CLIENT_MUTATION($data: CreateClientArgs!) {
    createClient(data: $data) {
      client_id
    }
  }
`

class ClientAddPage extends PureComponent {
  state = {
    client: {
      name: '',
      logoImageUrl: '',
      description: '',
      url: '',
      public: true,
      redirectUri: '',
      isActive: true
    },
    result: undefined
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
      secret
    }
    console.log(data)
    const res = await createClient({ variables: { data } })
    console.log(res)
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
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="name">
                        Name
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="text" className="form-control" name="name" value={this.state.client.name} onChange={this.handleChange} required readOnly={this.state.result !== undefined} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="logoImageUrl">
                        Logo Image Url
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="url" className="form-control" name="logoImageUrl" value={this.state.client.logoImageUrl} onChange={this.handleChange} required readOnly={this.state.result !== undefined} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="url">
                        Base Url
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="url" className="form-control" name="url" value={this.state.client.url} onChange={this.handleChange} required readOnly={this.state.result !== undefined} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="redirectUri">
                        Fallback Redirect Url
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="url" className="form-control" name="redirectUri" value={this.state.client.redirectUri} onChange={this.handleChange} aria-describedby="redirectUriHelpBlock" required readOnly={this.state.result !== undefined} />
                        <div id="redirectUriHelpBlock" className="small form-text text-muted">
                          This for redirecting back to your app following new user registration.
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="description">
                        Description
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <textarea className="form-control" name="description" value={this.state.client.description} onChange={this.handleChange} readOnly={this.state.result !== undefined} />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="public" name="public" value={this.state.client.public} onChange={this.handleChange} readOnly={this.state.result !== undefined} />
                        <label className="form-check-label" htmlFor="public">
                          Publicly visible
                        </label>
                      </div>
                    </div>

                    {this.state.result && (
                      <div className="alert alert-success">
                        <p>Success! Your client_id and client_secret that your application will use to authenticate users are listed below. Please note these values down as this is the only time the client_secret will be visible.</p>
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
                        <Link href="/clients">
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
