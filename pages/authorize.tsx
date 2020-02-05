import gql from 'graphql-tag'
import { withRouter, Router } from 'next/router'

import React, { useEffect } from 'react'
import { useMutation, useQuery } from 'react-apollo'

import Primary from '../presentation/layouts/primary'
import ErrorMessage from '../presentation/components/ErrorMessage'
import ClientAuthorization from '../presentation/components/ClientAuthorization'
import LoadingIndicator from '../presentation/components/LoadingIndicator'
import RequireAuthentication from '../presentation/components/RequireAuthentication'
import ActivityMessageContainerComponent from '../presentation/components/ActivityMessageContainer'

const VERIFY_AUTHORIZATION_REQUEST_MUTATION = gql`
  mutation VERIFY_AUTHORIZATION_REQUEST_MUTATION($client_id: String!, $redirect_uri: String!) {
    verifyAuthorizationRequest(data: { client_id: $client_id, redirect_uri: $redirect_uri }) {
      success
      message
    }
  }
`

const LOAD_AUTHORIZE_QUERY = gql`
  query LOAD_AUTHORIZE_QUERY($client_id: String!) {
    client(where: { client_id: $client_id }) {
      client_id
      name
      logoImageUrl
    }

    scopes {
      id
      required
      userDescription
      permissionLevel
    }
  }
`

export interface AuthorizePageProps {
  router: Router
}

const AuthorizePage = (props: AuthorizePageProps) => {
  const [
    verifyAuthorizationRequest,
    { data: verificationData, loading: verificationLoading, error: verificationError }
  ] = useMutation(VERIFY_AUTHORIZATION_REQUEST_MUTATION, {
    variables: { client_id: props.router.query.client_id, redirect_uri: props.router.query.redirect_uri }
  })

  const { data, loading } = useQuery(LOAD_AUTHORIZE_QUERY, {
    variables: { client_id: props.router.query.client_id }
  })

  let content
  useEffect(() => {
    verifyAuthorizationRequest()
  }, [props.router.query.client_id, verifyAuthorizationRequest])
  if (verificationError) {
    content = (
      <ActivityMessageContainerComponent>
        <ErrorMessage error={verificationError} />
      </ActivityMessageContainerComponent>
    )
  }
  if (verificationLoading) {
    content = (
      <ActivityMessageContainerComponent>
        <LoadingIndicator message="Verifying authorization request..." />
      </ActivityMessageContainerComponent>
    )
  } else {
    if (verificationData && !verificationData.verifyAuthorizationRequest.success) {
      content = (
        <ActivityMessageContainerComponent>
          <ErrorMessage error={{ message: verificationData.verifyAuthorizationRequest.message }} />
        </ActivityMessageContainerComponent>
      )
    }

    if (verificationData && verificationData.verifyAuthorizationRequest.success) {
      if (loading) {
        content = (
          <ActivityMessageContainerComponent>
            <LoadingIndicator message="Loading client..." />
          </ActivityMessageContainerComponent>
        )
      } else if (!data || !data.client) {
        content = (
          <ActivityMessageContainerComponent>
            <div className="alert alert-danger">Client not found</div>
          </ActivityMessageContainerComponent>
        )
      } else {
        content = (
          <div style={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
            <div className="container">
              <div className="row">
                <div className="col col-md-8 offset-md-2">
                  <ClientAuthorization
                    client={data.client}
                    responseType={props.router.query.response_type?.toString()}
                    redirectUri={props.router.query.redirect_uri?.toString()}
                    //TODO: This needs to be fixed to be only scope in the future

                    scope={(props.router.query.scope || props.router.query.scopes)?.toString()}
                    scopes={data.scopes}
                    state={props.router.query.state?.toString()}
                    nonce={props.router.query.nonce?.toString()}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <RequireAuthentication>
      <Primary>{content}</Primary>
    </RequireAuthentication>
  )
}

AuthorizePage.getInitialProps = ({ query, res }) => {
  const locals = res ? res.locals : {}
  return { query, ...locals }
}

export default withRouter(AuthorizePage)
