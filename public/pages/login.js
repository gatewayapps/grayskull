import Primary from '../layouts/primary'

const login = (props, ownProps) => (
  <Primary>
    <div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div className="container">
          <div className="row">
            <div className="col col-md-8 offset-md-2">
              <form noValidate method="post" className="form">
                <div className="card">
                  <div className="card-header">Login</div>
                  <div className="card-body">
                    {props.error && <div className="alert alert-danger">{props.error.message}</div>}
                    <div className="form-group">
                      <label htmlFor="name">E-mail Address: </label>
                      <input type="email" className="form-control" name="name" defaultValue={props.data.name} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password: </label>
                      <input type="password" className="form-control" name="password" />
                    </div>
                  </div>
                  <div className="card-footer">
                    <div className="btn-toolbar float-right">
                      <button className="btn btn-info" type="submit">
                        Login
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

login.getInitialProps = async ({ req, query, res }) => {
  return { data: req.body, query, ...res.locals }
}

export default login
