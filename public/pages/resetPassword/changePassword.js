import React from 'react'
import Primary from '../../layouts/primary'
import ChangePasswordForm from '../../components/ChangePasswordForm'
import BackgroundCover from '../../components/BackgroundCover'

class ChangePassword extends React.PureComponent {
  state = {
    fingerprint: ''
  }

  static async getInitialProps({ req, query, res }) {
    return { data: req.body, query, ...res.locals }
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
                    <ChangePasswordForm emailAddress={this.props.query.emailAddress} token={this.props.query.token} />
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

export default ChangePassword
