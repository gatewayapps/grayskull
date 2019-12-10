import gql from 'graphql-tag'
import { withRouter, Router } from 'next/router'

import React, { useEffect } from 'react'
import { Query, useMutation, useQuery } from 'react-apollo'

import Primary from '../client/layouts/primary'
import ErrorMessage from '../client/components/ErrorMessage'
import ClientAuthorization from '../client/components/ClientAuthorization'
import LoadingIndicator from '../client/components/LoadingIndicator'
import RequireAuthentication from '../client/components/RequireAuthentication'
import ActivityMessageContainerComponent from '../client/components/ActivityMessageContainer'

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

  const { data, loading, error } = useQuery(LOAD_AUTHORIZE_QUERY, {
    variables: { client_id: props.router.query.client_id }
  })

  let content
  useEffect(() => {
    verifyAuthorizationRequest()
  }, [props.router.query.client_id])
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
                    scope={props.router.query.scope?.toString()}
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

AuthorizePage.getInitialProps = ({ req, query, res }) => {
  const locals = res ? res.locals : {}
  return { query, ...locals }
}

export default withRouter(AuthorizePage)
