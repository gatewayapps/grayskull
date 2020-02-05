import React from 'react'
import Primary from '../presentation/layouts/primary'
export default class Error extends React.Component {
  static getInitialProps({ res }) {
    let error
    let statusCode
    if (res && res.locals) {
      error = res.locals.error
      statusCode = res.locals.statusCode
    }

    return { error, statusCode }
  }

  render() {
    let message = 'An error has occurred'
    if (this.props.error) {
      message = this.props.error.message
    }
    switch (this.props.statusCode) {
      case 400:
        message = '400 - Bad Request'
        break
      case 401:
        message = '401 - Not Authorized'
        break
      case 403:
        message = '403 - Forbidden'
        break
      case 404:
        message = '404 - Page not found'
        break
      case 405:
        message = '405 - Method Not Allowed'
        break
      case 500:
      case 501:
      case 502:
        message = `${this.props.statusCode} - Internal Server Error`
        break
    }
    return (
      <Primary>
        <div className="container mt-5">
          <div className="row">
            <div className="col-12 col-md-8 offset-md-2">
              <div className="alert alert-danger">{message}</div>
            </div>
          </div>
        </div>
      </Primary>
    )
  }
}
