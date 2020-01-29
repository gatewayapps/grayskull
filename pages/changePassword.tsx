import React from 'react'
import Primary from '../presentation/layouts/primary'
import ChangePasswordForm from '../presentation/components/ChangePasswordForm'
import BackgroundCover from '../presentation/components/BackgroundCover'
import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import LoadingIndicator from '../presentation/components/LoadingIndicator'
import ErrorMessage from '../presentation/components/ErrorMessage'

const VALIDATE_RESET_PASSWORD_TOKEN_MUTATION = gql`
  mutation VALIDATE_RESET_PASSWORD_TOKEN_MUTATION($emailAddress: String!, $token: String!) {
    validateResetPasswordToken(data: { emailAddress: $emailAddress, token: $token }) {
      success
      message
    }
  }
`

const ChangePassword = (props) => {
  const [validateResetPasswordToken, { loading, data, error }] = useMutation(VALIDATE_RESET_PASSWORD_TOKEN_MUTATION, {
    variables: { ...props.query }
  })
  if (!loading && !data) {
    validateResetPasswordToken()
    return <LoadingIndicator message="Validating token..." />
  }
  if (loading) {
    return <LoadingIndicator message="Validating token..." />
  }
  if (error) {
    return <ErrorMessage error={error} />
  }
  if (data && !data.validateResetPasswordToken.success) {
    return <ErrorMessage error={{ message: data.message }} />
  }
  if (data && data.validateResetPasswordToken.success) {
    return (
      <Primary>
        <div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,
              display: 'flex',
              flexDirection: 'column'
            }}>
            <BackgroundCover>
              <div style={{ flex: 1 }} />
              <div className="container">
                <div className="row">
                  <div className="col col-md-8 offset-md-2">
                    <ChangePasswordForm emailAddress={props.query.emailAddress} token={props.query.token} />
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

ChangePassword.getInitialProps = ({ query }) => {
  return { query }
}

export default ChangePassword
