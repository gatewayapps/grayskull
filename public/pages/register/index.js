import Primary from '../../layouts/primary'
import React from 'react'

const register = (props, ownProps) => {
  return (
    <Primary>
      <div>
        <div className="container pt-4">
          <div className="row">
            <div className="col col-md-8 offset-md-2">
              <form noValidate method="post" className="form">
                <div className="card">
                  <div className="card-header">Register for {props.client.name}</div>
                  <div className="card-body">
                    {props.error && <div className="alert alert-danger">{props.error.message}</div>}
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="emailAddress">
                        E-mail Address:{' '}
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="text" readOnly className="form-control-plaintext" name="emailAddress" value={props.emailAddress} />
                      </div>
                    </div>
                    <div className="form-group row mt-5">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="firstName">
                        First Name:{' '}
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="text" className="form-control" name="firstName" defaultValue={props.data.firstName} />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="lastName">
                        Last Name:{' '}
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="text" className="form-control" name="lastName" defaultValue={props.data.lastName} />
                      </div>
                    </div>
                    <div className="form-group row mt-5">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="password">
                        Password:{' '}
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="password" className="form-control" name="password" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-sm-12 col-md-3 col-form-label" htmlFor="confirm">
                        Confirm:{' '}
                      </label>
                      <div className="col-sm-12 col-md-9">
                        <input type="password" className="form-control" name="confirm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="btn-toolbar float-right">
                    <button className="btn btn-info" type="submit">
                      Register
                    </button>
                  </div>
                  <div className="clearfix" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Primary>
  )
}

register.getInitialProps = async ({ req, query, res }) => {
  console.log(res.locals)
  return { data: req.body, query, emailAddress: res.locals.emailAddress, ...res.locals }
}

export default register
