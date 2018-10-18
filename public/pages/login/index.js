import React from 'react'
import Link from 'next/link'
import Primary from '../../layouts/primary'
import generateFingerprint from '../../utils/generateFingerprint'

class Login extends React.PureComponent {
  state = {
    fingerprint: ''
  }

  static async getInitialProps({ req, query, res }) {
    return { data: req.body, query, ...res.locals }
  }

  async componentDidMount() {
    const fingerprint = await generateFingerprint()
    this.setState({ fingerprint })
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
                    <input type='hidden' name='sessionId' value={this.state.fingerprint} required />
                    <div className="card">
                      <div className="card-header" >Login to {props.client.name}</div>
                      <div className="card-body">
                        {props.message && <div className='alert alert-info'>{props.message}</div>}
                        {props.error && <div className="alert alert-danger">{props.error.message}</div>}
                        <div className='row'>
                          <div className='col-3'>
                            {props.client.logoImageUrl && <img src={props.client.logoImageUrl} style={{ width: '100%' }} />}
                          </div>
                          <div className='col-9'>
                            <div className="form-group">
                              <label htmlFor="name">E-mail Address: </label>
                              <input type="email" className="form-control" name="emailAddress" defaultValue={props.data.name} />
                            </div>
                            <div className="form-group">
                              <label htmlFor="password">Password: </label>
                              <input type="password" className="form-control" name="password" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <Link href='/resetPassword'>
                          <div className='btn-toolbar float-left'>
                            <button className='btn btn-link'>Forgot Password</button>
                          </div>
                        </Link>
                        <div className="btn-toolbar float-right">
                          <button className="btn btn-outline-info" type="submit">
                            <i className='fal fa-sign-in' /> Login
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
