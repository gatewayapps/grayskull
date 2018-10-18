import React from 'react'
import Primary from '../../layouts/primary'

class Login extends React.PureComponent {
  state = {
    fingerprint: ''
  }

  static async getInitialProps({ req, query, res }) {
    return { data: req.body, query, ...res.locals }
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
        <div>
          {this.props.error && (
            <div className="row">
              <div className="col-12">
                <div className=" my-3 alert alert-danger">{this.props.error.message}</div>
              </div>
            </div>
          )}
          <div className="row">
            <div className="col-12">
              <div className="form-group">
                <label htmlFor="name">New Password: </label>
                <input type="password" className="form-control" name="password" />
              </div>
              <div className="form-group">
                <label htmlFor="name">Confirm Password: </label>
                <input type="password" className="form-control" name="confirm" />
              </div>
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
                      <div className="card-header">Change your password</div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12">
                            <h6 class="card-subtitle mb-2 text-muted">Please enter your new password below, then re-type it to confirm.</h6>
                          </div>
                        </div>

                        {this.renderBody()}
                      </div>
                      <div className="card-footer">
                        <div className="btn-toolbar float-right">
                          <button disabled={this.props.message} className="btn btn-outline-success" type="submit">
                            <i className="fal fa-save" /> Save Password
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
