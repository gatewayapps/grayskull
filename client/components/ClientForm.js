import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import uuid from 'uuid/v4'
import { isUrl, isUrlOrEmpty, isValidUrl } from '../utils/validationHelpers'
import FormValidation, { FormValidationRule } from './FormValidation'
import FormValidationMessage from './FormValidationMessage'
import ImageDropArea from './ImageDropArea'

class ClientForm extends PureComponent {
  handleChange = (e, validate) => {
    const finalValue = e.target.type === 'checkbox' ? e.target.checked : e.target.value

    this.props.onChange(e.target.name, finalValue)
    if (validate) {
      validate()
    }
  }

  handleRedirectUriChange = (key, value, validate) => {
    const redirectUris = this.props.client.redirectUris.map((r) => {
      if (r.key === key) {
        return { ...r, value }
      } else {
        return { ...r }
      }
    })
    this.props.onChange('redirectUris', redirectUris)
    if (validate) {
      validate()
    }
  }

  handleScopeCheckChanged = (e) => {
    const { name, checked } = e.target
    if (checked) {
      if (!this.props.client.scopes.includes(name)) {
        const scopes = [...this.props.client.scopes, name]
        this.props.onChange('scopes', scopes)
      }
    } else {
      const scopes = this.props.client.scopes.filter((scope) => scope !== name)
      this.props.onChange('scopes', scopes)
    }
  }

  handleImageUpload = (name, url, validate) => {
    this.props.onChange(name, url)
    if (validate) {
      validate()
    }
  }

  componentDidMount() {
    const scopes = this.props.client.scopes
    this.props.scopes
      .filter((scope) => scope.required)
      .forEach((scope) => {
        if (!scopes.includes(scope.id)) {
          scopes.push(scope.id)
        }
      })
    this.props.onChange('scopes', scopes)
  }

  addRedirectUri = (validate) => {
    const redirectUris = [...this.props.client.redirectUris, { key: uuid(), value: '' }]
    this.props.onChange('redirectUris', redirectUris)
    if (validate) {
      validate()
    }
  }

  removeRedirectUri = (key, validate) => {
    if (this.props.client.redirectUris.length === 1) {
      return
    }

    const redirectUris = this.props.client.redirectUris.filter((r) => r.key !== key)
    this.props.onChange('redirectUris', redirectUris)
    if (validate) {
      validate()
    }
  }

  render() {
    const validators = [
      new FormValidationRule('name', 'isEmpty', false, 'Name is required'),
      new FormValidationRule('logoImageUrl', 'isEmpty', false, 'Logo Image must be provided'),
      new FormValidationRule('baseUrl', isUrl, true, 'Base Url should be a valid URL'),
      new FormValidationRule('homePageUrl', isUrlOrEmpty, true, 'Home Page Url should be a valid URL'),
      ...this.props.client.redirectUris.map((r, idx) => {
        return new FormValidationRule(`redirectUris.${idx}.value`, isUrl, true, 'Redirect URI should be a valid URL')
      })
    ]

    return (
      <FormValidation validations={validators} data={this.props.client} onValidated={this.props.onValidated}>
        {({ validate, validationErrors }) => (
          <div>
            <div className="form-group row">
              <label className="col-sm-12 col-md-3 col-form-label" htmlFor="name">
                Name
              </label>
              <div className="col-sm-12 col-md-9">
                <input
                  type="text"
                  className={`form-control ${validationErrors['name'] ? 'is-invalid' : 'is-valid'}`}
                  name="name"
                  value={this.props.client.name}
                  onChange={(e) => this.handleChange(e, validate)}
                  required
                  readOnly={this.props.readOnly}
                  autoFocus
                  aria-describedby="nameErrorBlock"
                />
                <FormValidationMessage id="nameErrorBlock" validationErrors={validationErrors['name']} />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-12 col-md-3 col-form-label" htmlFor="logoImageUrl">
                Logo Image Url
              </label>
              <div className="col-sm-12 col-md-9">
                <ImageDropArea
                  className={validationErrors['logoImageUrl'] ? 'is-invalid' : ''}
                  disabled={this.props.readOnly}
                  onUploadComplete={({ url }) => this.handleImageUpload('logoImageUrl', url, validate)}
                  style={{ width: '150px', height: '150px' }}
                  value={this.props.client.logoImageUrl}
                  aria-describedby="logoImageUrlErrorBlock">
                  <div className="p-3">Click or drag an image here to set the client logo</div>
                </ImageDropArea>
                <FormValidationMessage
                  id="logoImageUrlErrorBlock"
                  validationErrors={validationErrors['logoImageUrl']}
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
                  className={`form-control ${validationErrors['baseUrl'] ? 'is-invalid' : 'is-valid'}`}
                  name="baseUrl"
                  value={this.props.client.baseUrl}
                  onChange={(e) => this.handleChange(e, validate)}
                  required
                  readOnly={this.props.readOnly}
                  aria-describedby="baseUrlHelpBlock baseUrlErrorBlock"
                />
                <FormValidationMessage id="baseUrlErrorBlock" validationErrors={validationErrors['baseUrl']} />
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
                  className={`form-control ${validationErrors['homePageUrl'] ? 'is-invalid' : 'is-valid'}`}
                  name="homePageUrl"
                  value={this.props.client.homePageUrl}
                  onChange={(e) => this.handleChange(e, validate)}
                  readOnly={this.props.readOnly}
                  aria-describedby="homePageUrlHelpBlock homePageUrlErrorBlock"
                />
                <FormValidationMessage id="homePageUrlErrorBlock" validationErrors={validationErrors['homePageUrl']} />
                <div id="homePageUrlHelpBlock" className="small form-text text-muted">
                  The url for the home page of the client application. You can leave this blank if the home page is the
                  same as the Base Url.
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-12 col-md-3 col-form-label" htmlFor="redirectUri">
                Redirect URI(s)
              </label>
              <div className="col-sm-12 col-md-9">
                {this.props.client.redirectUris.map((redirectUri, index) => (
                  <div key={redirectUri.key}>
                    <div className="input-group mb-2">
                      <input
                        type="url"
                        className={`form-control ${
                          validationErrors[`redirectUris.${index}.value`] ? 'is-invalid' : 'is-valid'
                        }`}
                        name={`redirectUris.${index}`}
                        onChange={(e) => this.handleRedirectUriChange(redirectUri.key, e.target.value, validate)}
                        required
                        readOnly={this.props.readOnly}
                        value={redirectUri.value}
                        aria-describedby={`redirectUris.${index}-errorBlock`}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-danger"
                          type="button"
                          onClick={() => this.removeRedirectUri(redirectUri.key, validate)}>
                          <i className="fal fa-fw fa-trash" />
                        </button>
                      </div>
                    </div>
                    <FormValidationMessage
                      id={`redirectUris.${index}-errorBlock`}
                      validationErrors={validationErrors[`redirectUris.${index}.value`]}
                    />
                  </div>
                ))}
                <button className="btn btn-link btn-sm" onClick={() => this.addRedirectUri(validate)} type="button">
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
                  className={`form-control ${validationErrors['description'] ? 'is-invalid' : 'is-valid'}`}
                  name="description"
                  value={this.props.client.description}
                  onChange={(e) => this.handleChange(e, validate)}
                  readOnly={this.props.readOnly}
                />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-sm-12 col-md-3 col-form-label">Scopes</label>
              <div className="col-sm-12 col-md-9">
                {this.props.scopes.map((scope) => (
                  <div key={scope.id} className="form-check">
                    <input
                      type="checkbox"
                      id={scope.id}
                      disabled={scope.required}
                      name={scope.id}
                      className="form-check-input"
                      checked={this.props.client.scopes.includes(scope.id)}
                      onChange={this.handleScopeCheckChanged}
                      aria-describedby="scopesHelpBlock"
                    />
                    <label htmlFor={scope.id} className="form-check-label">
                      {scope.clientDescription}
                    </label>
                  </div>
                ))}
                <small id="scopesHelpBlock" className="form-text text-muted">
                  Scopes identify the information about a user that a client can request permission from the user to
                  access or update.
                </small>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="public"
                  name="public"
                  checked={this.props.client.public}
                  onChange={(e) => this.handleChange(e, validate)}
                  readOnly={this.props.readOnly}
                />
                <label className="form-check-label" htmlFor="public">
                  Publicly visible
                </label>
              </div>
            </div>
            <div className="form-group">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="pinToHeader"
                  name="pinToHeader"
                  checked={this.props.client.pinToHeader}
                  onChange={(e) => this.handleChange(e, validate)}
                  readOnly={this.props.readOnly}
                />
                <label className="form-check-label" htmlFor="pinToHeader">
                  Pin to Header
                </label>
              </div>
            </div>
          </div>
        )}
      </FormValidation>
    )
  }
}

ClientForm.propTypes = {
  client: PropTypes.shape({
    name: PropTypes.string.isRequired,
    logoImageUrl: PropTypes.string.isRequired,
    baseUrl: PropTypes.string.isRequired,
    homePageUrl: PropTypes.string.isRequired,
    redirectUris: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    description: PropTypes.string.isRequired,
    public: PropTypes.bool,
    pinToHeader: PropTypes.bool
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onValidated: PropTypes.func,
  readOnly: PropTypes.bool,
  scopes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      clientDescription: PropTypes.string.isRequired
    })
  ).isRequired
}

export default ClientForm
