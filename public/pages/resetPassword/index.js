import React from 'react'
import Primary from '../../layouts/primary'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import BackgroundCover from '../../components/BackgroundCover'

const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD($emailAddress: String!) {
    resetPassword(data: { emailAddress: $emailAddress })
  }
`

class Login extends React.PureComponent {
  state = {
    fingerprint: '',
    emailAddress: '',
    emailSent: false
  }

  render() {
    const { props } = this

    return (
      <Primary>
        <div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
            <BackgroundCover>
              <div style={{ flex: 1 }} />
              <div className="container">
                <div className="row">
                  <div className="col col-md-8 offset-md-2">
                    <Mutation mutation={RESET_PASSWORD} variables={{ emailAddress: this.state.emailAddress }}>
                      {(resetPassword, { loading }) => {
                        return (
                          <div className="card">
                            <div className="card-header">Reset your password</div>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-12">
                                  <h6 className="card-subtitle mb-2 text-muted">Enter your email address and we will send you instructions for resetting your password.</h6>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-12">
                                  <div className="form-group">
                                    <input
                                      placeholder="E-mail address"
                                      type="email"
                                      onChange={(e) => {
                                        this.setState({ emailAddress: e.target.value, emailSent: false })
                                      }}
                                      className="form-control"
                                      name="emailAddress"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            {this.state.emailSent && (
                              <div className="row">
                                <div className="col-12">
                                  <div className="alert alert-primary mx-4">An e-mail with instructions has been sent to {this.state.emailAddress}</div>
                                </div>
                              </div>
                            )}
                            <div className="card-footer">
                              <div className="btn-toolbar float-right">
                                <button
                                  disabled={loading || this.state.emailSent}
                                  className="btn btn-outline-primary"
                                  type="button"
                                  onClick={async () => {
                                    const result = await resetPassword()
                                    this.setState({ emailSent: true })
                                  }}>
                                  {loading ? <i className="fa fa-spin fa-fw fa-spinner" /> : <i className="fa fa-fw fa-history" />}
                                  Reset Password
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      }}
                    </Mutation>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1 }} />
            </BackgroundCover>
          </div>
        </div>
      </Primary>
    )
  }
}

export default Login
