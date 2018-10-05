import Primary from '../layouts/primary'

const register = (props, ownProps) => (
  <Primary>
    <div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div className="container">
          <div className="row">
            <div className="col col-md-8 offset-md-2">
              <form noValidate method="post" className="form">
                <div className="card">
                  <div className="card-header">Register for {props.client.name}</div>
                  <div className="card-body">
                  {props.error && <div className="alert alert-danger">{`${props.error.message}`}</div>}
                      <div className="form-group row">
                        <label className='col-2 col-form-label' htmlFor="emailAddress">E-mail Address: </label>
                        <div className='col-10'>
                          <input type="text" readOnly className="form-control-plaintext" name="emailAddress" value={props.emailAddress} />
                        </div>
                      </div>
                      <div className='form-group row mt-5'>
                      <label className='col-2 col-form-label' htmlFor="firstName">First Name: </label>
                        <div className='col-10'>
                          <input type="text" className="form-control" name="firstName" />
                        </div>
                      </div>
                      <div className='form-group row'>
                      <label className='col-2 col-form-label' htmlFor="lastName">Last Name: </label>
                        <div className='col-10'>
                          <input type="text" className="form-control" name="lastName" />
                        </div>
                      </div>
                      <div className="form-group row mt-5">
                        <label className='col-2 col-form-label' htmlFor="password">Password: </label>
                        <div className='col-10'>
                          <input type="password" className="form-control" name="password" />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className='col-2 col-form-label' htmlFor="confirm">Confirm: </label>
                        <div className='col-10'>
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
                    <div className='clearfix' />
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

register.getInitialProps = async ({ req, query, res }) => {
  return { data: req.body, query, emailAddress: res.locals.emailAddress, client: res.locals.client, error: res.locals.error }
}

export default register
