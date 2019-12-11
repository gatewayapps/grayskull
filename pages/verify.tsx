/* eslint-disable react/prop-types */
import React, { useContext } from 'react'

import gql from 'graphql-tag'
import { useMutation } from 'react-apollo'
import LoadingIndicator from '../client/components/LoadingIndicator'
import ErrorMessage from '../client/components/ErrorMessage'
import { Jumbotron } from 'reactstrap'

import Primary from '../client/layouts/primary'
import BackgroundCoverComponent from '../client/components/BackgroundCover'
import UserContext from '../client/contexts/UserContext'

const VERIFY_EMAIL_ADDRESS_MUTATION = gql`
  mutation VERIFY_EMAIL_ADDRESS_MUTATION($emailAddress: String!, $code: String!) {
    verifyEmailAddress(data: { emailAddress: $emailAddress, code: $code }) {
      success
      message
    }
  }
`
//http://127.0.0.1/verify?address=daniel@gatewayapps.com&code=058c94fc90a2307d4e0db42347989b4c

const VerifyEmailAddress = (props) => {
  const [verifyEmailAddressMutation, { loading, data: result, error }] = useMutation(VERIFY_EMAIL_ADDRESS_MUTATION, {
    variables: { emailAddress: props.query.address, code: props.query.code }
  })

  const data = result ? result.verifyEmailAddress : undefined
  return (
    <Primary>
      <BackgroundCoverComponent>
        <Jumbotron>
          <div style={{ maxWidth: '960px', width: '100vw' }} className="alert alert-primary">
            <UserContext.Consumer>
              {({ user }) => {
                if (!loading && !data) {
                  verifyEmailAddressMutation()
                  return <LoadingIndicator message="Verifying email address..." />
                }
                if (loading) {
                  return <LoadingIndicator message="Verifying email address..." />
                }
                if (error) {
                  return <ErrorMessage error={{ message: error.message }} />
                }
                if (data && !data.success) {
                  return <ErrorMessage error={{ message: data.message }} />
                }
                if (data && data.success) {
                  if (user) {
                    window.location.href = '/personal-info'
                    return <LoadingIndicator message="Redirecting to your profile..." />
                  } else {
                    window.location.href = '/login?emailVerified=1'
                    return <LoadingIndicator message="Redirecting to login..." />
                  }
                }
                return <Jumbotron>Something went wrong!</Jumbotron>
              }}
            </UserContext.Consumer>
          </div>
        </Jumbotron>
      </BackgroundCoverComponent>
    </Primary>
  )
}

VerifyEmailAddress.getInitialProps = ({ res, req, query }) => {
  return { query }
}

export default VerifyEmailAddress
