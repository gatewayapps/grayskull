import React, { useState } from 'react'
import Primary from '../presentation/layouts/primary'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import BackgroundCover from '../presentation/components/BackgroundCover'
import ResponsiveForm from '../presentation/components/ResponsiveForm'

const RESET_PASSWORD = gql`
  mutation RESET_PASSWORD($emailAddress: String!) {
    resetPassword(data: { emailAddress: $emailAddress })
  }
`

const Login = (props) => {
  const defaultEmailAddress = props.query && props.query.emailAddress ? props.query.emailAddress : ''

  const [emailAddress, setEmailAddress] = useState(defaultEmailAddress)
  const [emailSent, setEmailSent] = useState(false)

  return (
    <Primary>
      <BackgroundCover>
        <div className="container">
          <Mutation mutation={RESET_PASSWORD} variables={{ emailAddress: emailAddress }}>
            {(resetPassword, { loading }) => {
              return (
                <ResponsiveForm
                  formHeader={<span>Reset your password</span>}
                  formBody={
                    <div>
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
                              value={emailAddress}
                              type="email"
                              onChange={(e) => {
                                setEmailAddress(e.target.value)
                                setEmailSent(false)
                              }}
                              className="form-control"
                              name="emailAddress"
                            />
                          </div>
                        </div>
                      </div>

                      {emailSent && (
                        <div className="row">
                          <div className="col-12">
                            <div className="alert alert-primary mx-4">An e-mail with instructions has been sent to {emailAddress}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  }
                  formFooter={
                    <div className="btn-toolbar float-right">
                      <button
                        disabled={loading || emailSent}
                        className="btn btn-outline-primary"
                        type="button"
                        onClick={async () => {
                          const result = await resetPassword()
                          setEmailSent(true)
                        }}>
                        {loading ? <i className="fa fa-spin fa-fw fa-spinner" /> : <i className="fa fa-fw fa-history" />}
                        Reset Password
                      </button>
                    </div>
                  }
                />
              )
            }}
          </Mutation>
        </div>
      </BackgroundCover>
    </Primary>
  )
}

Login.getInitialProps = async ({ req, query, params }) => {
  if (req) {
    return { query: req.query, params: req.params }
  }

  return { query, params }
}

export default Login
