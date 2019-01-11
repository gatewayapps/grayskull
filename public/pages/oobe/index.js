import React from 'react'
import Primary from '../../layouts/primary'
export default class OobeIndex extends React.Component {
  render() {
    return (
      <Primary>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: 'url(/static/bg.jpg)' }}>
          <div className="container d-flex h-100" style={{ overflow: 'auto' }}>
            <div className="justify-content-center align-self-center w-100" style={{ maxHeight: '100%' }}>
              <h4 className="display-4 text-center w-100 mb-5" style={{ fontSize: '4vmin' }}>
                Welcome to your Grayskull Authentication Server
              </h4>
              <div className="row justify-content-center ">
                <div className="col-sm-12 col-md-8 col-push-2">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-text">
                        This is a first time setup process to help you configure Grayskull for your needs. Before we get started, make sure you have completed the following steps:
                      </p>

                      <ul className="list-group">
                        <li className="list-group-item">Have a persistent volume mounted to /config</li>
                        <li className="list-group-item">Have a PostgreSQL database available with admin credentials</li>
                      </ul>
                      <p className="card-text mt-4">If you are ready to get started, click Next below</p>
                    </div>
                    <div className="card-footer">
                      <div className="btn-toolbar float-right">
                        <button type="button" className="btn btn-outline-success">
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Primary>
    )
  }
}
