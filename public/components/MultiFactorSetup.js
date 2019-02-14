import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import qrcode from 'qrcode'
import React, { PureComponent } from 'react'
import { ApolloConsumer } from 'react-apollo'
import urlParse from 'url-parse'
import LoadingIndicator from './LoadingIndicator'
import CopyTextField from './CopyTextField'

const GENERATE_MFA_KEY = gql`
  mutation GENERATE_MFA_KEY($emailAddress: String!) {
    generateMfaKey(data: { emailAddress: $emailAddress })
  }
`

const VERIFY_MFA_KEY = gql`
  mutation VERIFY_MFA_KEY($secret: String!, $token: String!) {
    verifyMfaKey(data: { secret: $secret, token: $token })
  }
`

class MultiFactorSetup extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      keyUri: '',
      otpSecret: '',
      qrcodeImage: '',
      token: '',
      isVerified: false,
      showSecret: false
    }
  }

  componentDidMount = () => {
    this.generateSecret(this.apolloClient)
  }

  cancelSetup = () => {
    if (this.props.required) {
      return
    }

    this.setState(
      {
        keyUri: '',
        otpSecret: '',
        qrcodeImage: '',
        token: '',
        isVerified: false,
        showSecret: false
      },
      () => {
        if (this.props.onCancel) {
          this.props.onCancel()
        }
      }
    )
  }

  handleTokenChanged = (e) => {
    this.setState({ token: e.target.value })
  }

  generateSecret = async (client) => {
    const { data } = await client.mutate({
      mutation: GENERATE_MFA_KEY,
      variables: { emailAddress: this.props.emailAddress, userAccountId: this.props.userAccountId }
    })
    if (data && data.generateMfaKey) {
      qrcode.toDataURL(data.generateMfaKey, (err, qrcodeImage) => {
        if (err) {
          console.log('Error with QR')
          console.error(err)
          return
        }
        const parsed = urlParse(data.generateMfaKey, true)
        this.setState({
          keyUri: data.generateMfaKey,
          otpSecret: parsed.query.secret,
          qrcodeImage,
          token: '',
          isVerified: false,
          showSecret: false
        })
      })
    }
  }

  verifyToken = async (client) => {
    const { data } = await client.mutate({
      mutation: VERIFY_MFA_KEY,
      variables: { secret: this.state.otpSecret, token: this.state.token }
    })
    if (data && data.verifyMfaKey === true) {
      this.setState({ isVerified: true }, () => {
        this.props.onVerified(this.state.otpSecret)
      })
    }
  }

  renderVerify = (client) => {
    return (
      <div>
        <ol>
          <li>Install an "authenticator" app from the app store on your phone.</li>
          <li>Open the app.</li>
          <li>
            Scan this barcode with your authenticator app.
            <div>
              <img src={this.state.qrcodeImage} />
            </div>
            {!this.state.showSecret && (
              <button className="btn btn-link" onClick={this.displaySecret}>
                I can't scan the bar code
              </button>
            )}
            {this.state.showSecret && (
              <p>
                <div>
                  <CopyTextField label="Type the following key into your authenticator app" text={this.state.otpSecret} />
                </div>
              </p>
            )}
          </li>
          {!this.state.isVerified && (
            <li>
              <p>Verify the authenticator app is setup correctly by entering a code below.</p>
              <p>
                <input type="text" className="form-control" placeholder="Enter code here" value={this.state.token} onChange={this.handleTokenChanged} />
              </p>
              <div>
                <button className="btn btn-primary" onClick={() => this.verifyToken(client)}>
                  Verify Code
                </button>
                {!this.props.required && (
                  <button className="btn btn-link" onClick={this.cancelSetup}>
                    Cancel
                  </button>
                )}
              </div>
            </li>
          )}
          {this.state.isVerified && <li>Authentication code verified!</li>}
        </ol>
      </div>
    )
  }

  displaySecret = () => {
    this.setState({ showSecret: true })
  }

  render() {
    return (
      <ApolloConsumer>
        {(apolloClient) => {
          this.apolloClient = apolloClient

          return (
            <div>
              <h5>Multi-Factor Authentication</h5>
              {this.state.keyUri ? this.renderVerify(apolloClient) : <LoadingIndicator />}
            </div>
          )
        }}
      </ApolloConsumer>
    )
  }
}

MultiFactorSetup.propTypes = {
  emailAddress: PropTypes.string.isRequired,
  required: PropTypes.bool,

  onCancel: PropTypes.func,
  onVerified: PropTypes.func.isRequired
}

export default MultiFactorSetup
