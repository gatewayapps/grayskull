import React from 'react'
import Primary from '../../layouts/primary'

class Login extends React.PureComponent {
  state = {
    fingerprint: ''
  }

  static async getInitialProps({ req, query, res }) {
    if (req && res) {
      return { data: req && req.body, query, ...res.locals }
    } else {
      return { query }
    }
  }

  renderBody() {
    if (this.props.message) {
      return (
        <div className="row">
          <div className="col-12">
            <div className=" my-3 alert alert-info">{this.props.message}</div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="name">E-mail Address: </label>
              <input type="email" className="form-control" name="emailAddress" />
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    const { props } = this

    return (
      <Primary>
        <div>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }} />
            <div className="container">
              <div className="row">
                <div className="col col-md-8 offset-md-2">
                  <form noValidate method="post" className="form">
                    <div className="card">
                      <div className="card-header">Reset your password</div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12">
                            <h6 class="card-subtitle mb-2 text-muted">Enter your email address and we will send you instructions for resetting your password.</h6>
                          </div>
                        </div>

                        {this.renderBody()}
                      </div>
                      <div className="card-footer">
                        <div className="btn-toolbar float-right">
                          <button disabled={this.props.message} className="btn btn-outline-info" type="submit">
                            <i className="fal fa-reset" /> Reset Password
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
      </Primary>
    )
  }
}

export default Login
