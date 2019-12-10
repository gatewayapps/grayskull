import React, { useState, useEffect } from 'react'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import LoadingIndicator from './LoadingIndicator'

import SignOut from './SignOut'

import UserContext from '../contexts/UserContext'

const AUTHORIZE_CLIENT_MUTATION = gql`
  mutation AUTHORIZE_CLIENT_MUTATION(
    $client_id: String!
    $responseType: String!
    $redirectUri: String!
    $scope: String
    $state: String
    $nonce: String
  ) {
    authorizeClient(
      data: {
        client_id: $client_id
        responseType: $responseType
        redirectUri: $redirectUri
        scope: $scope
        state: $state
        nonce: $nonce
      }
    ) {
      pendingScopes
      redirectUri
    }
  }
`

const UPDATE_CLIENT_SCOPES_MUTATION = gql`
  mutation UPDATE_CLIENT_SCOPES_MUTATION($client_id: String!, $allowedScopes: [String]!, $deniedScopes: [String]!) {
    updateClientScopes(data: { client_id: $client_id, allowedScopes: $allowedScopes, deniedScopes: $deniedScopes })
  }
`

interface IClientAuthorizationState {
  initialized: boolean
  isSaving: boolean
  pendingScopes: any[]
  allowedScopes: any[]
  deniedScopes: any[]
}

const ClientAuthorizationComponent: React.FC<IClientAuthorizationProps> = (props) => {
  const [isSaving, setIsSaving] = useState(false)
  const [pendingScopes, setPendingScopes] = useState([])
  const [allowedScopes, setAllowedScopes] = useState([])
  const [deniedScopes, setDeniedScopes] = useState([])

  const [
    authorizeClient,
    { data: authorizeClientData, loading: authorizeClientLoading, error: authorizeClientError }
  ] = useMutation(AUTHORIZE_CLIENT_MUTATION, {
    variables: {
      client_id: props.client.client_id,
      responseType: props.responseType,
      redirectUri: props.redirectUri,
      scope: props.scope,
      state: props.state,
      nonce: props.nonce
    }
  })

  const [
    updateScopes,
    { data: updateScopesData, loading: updateScopesLoading, error: updateScopesError }
  ] = useMutation(UPDATE_CLIENT_SCOPES_MUTATION, {
    variables: {
      client_id: props.client.client_id,
      allowedScopes: allowedScopes,
      deniedScopes: deniedScopes
    }
  })

  const handleScopeCheckChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    if (checked) {
      if (!allowedScopes.includes(name)) {
        setAllowedScopes([...allowedScopes, name])
      }
      setDeniedScopes(deniedScopes.filter((s) => s !== name))
    } else {
      if (!deniedScopes.includes(name)) {
        setDeniedScopes([...deniedScopes, name])
      }
      setAllowedScopes(allowedScopes.filter((s) => s !== name))
    }
  }

  const updateClientScopes = async () => {
    updateScopes()
    if (updateScopesData && updateScopesData.updateClientScopes) {
      authorizeClient()
    }
  }
  const onDenyClicked = async () => {
    const query = ['error=consent_required']
    if (props.state) {
      query.push(`state=${encodeURIComponent(props.state)}`)
    }

    window.location.replace(`${props.redirectUri}?${query.join('&')}`)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    updateClientScopes()
  }

  useEffect(() => {
    authorizeClient()
  }, [props.client.client_id])

  if (authorizeClientLoading) {
    return <LoadingIndicator />
  }

  if (authorizeClientData && authorizeClientData.authorizeClient) {
    setIsSaving(false)
    if (authorizeClientData.authorizeClient.redirectUri) {
      window.location.replace(authorizeClientData.authorizeClient.redirectUri)
      return <LoadingIndicator message="Redirecting..." />
    }
    if (authorizeClientData.authorizeClient.pendingScopes) {
      setAllowedScopes(authorizeClientData.authorizeClient.pendingScopes)
      setPendingScopes(authorizeClientData.authorizeClient.pendingScopes)
    }
  }

  return (
    <UserContext.Consumer>
      {({ user }) => (
        <form onSubmit={onSubmit}>
          <div className="card">
            <div className="card-header">Authorize {props.client.name}</div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-3">
                  {props.client.logoImageUrl && <img src={props.client.logoImageUrl} style={{ width: '100%' }} />}
                </div>
                <div className="col-lg-9">
                  <div className="mt-2">
                    <strong>{props.client.name}</strong> would like to:
                  </div>
                  {props.scopes
                    .filter((s) => pendingScopes.includes(s.id) && s.permissionLevel <= user.permissions)
                    .map((scope) => (
                      <div key={scope.id} className="form-check my-2 mx-4">
                        <input
                          type="checkbox"
                          id={scope.id}
                          disabled={scope.required}
                          name={scope.id}
                          className="form-check-input"
                          checked={allowedScopes.includes(scope.id)}
                          onChange={handleScopeCheckChanged}
                        />
                        <label htmlFor={scope.id} className="form-check-label">
                          {scope.userDescription}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <div>
                  Logged in as{' '}
                  <strong>
                    {user.firstName} {user.lastName}
                  </strong>{' '}
                  (<SignOut includeState>Not You?</SignOut>)
                </div>
              </div>
            </div>
            <div className="card-footer clearfix">
              <div className="btn-toolbar float-right">
                <button
                  type="button"
                  className="btn btn-outline-danger mr-3"
                  disabled={isSaving}
                  onClick={onDenyClicked}>
                  <i className="fal fa-times fa-fw" /> Deny
                </button>
                <button type="submit" className="btn btn-success" disabled={isSaving}>
                  <i className="fal fa-check fa-fw" /> Authorize
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </UserContext.Consumer>
  )
}

// class ClientAuthorization extends React.Component<IClientAuthorizationProps, IClientAuthorizationState> {
//   state = {
//     initialized: false,
//     isSaving: false,
//     pendingScopes: [],
//     allowedScopes: [],
//     deniedScopes: []
//   }
//   apolloClient: any

//   componentDidMount() {
//     authorizeClient()
//   }

//   handleScopeCheckChanged = (e) => {
//     const { name, checked } = e.target
//     if (checked) {
//       // add to allowed and remove from denied
//       setState((prevState) => ({
//         ...prevState,
//         allowedScopes: prevallowedScopes.includes(name) ? prevallowedScopes : prevallowedScopes.concat([name]),
//         deniedScopes: prevdeniedScopes.filter((denied) => denied !== name)
//       }))
//     } else {
//       // add to denied and remove from allowed
//       setState((prevState) => ({
//         ...prevState,
//         allowedScopes: prevallowedScopes.filter((allowed) => allowed !== name),
//         deniedScopes: prevdeniedScopes.includes(name) ? prevdeniedScopes : prevdeniedScopes.concat([name])
//       }))
//     }
//   }

//   authorizeClient = async () => {
//     const { data } = await apolloClient.mutate({
//       mutation: AUTHORIZE_CLIENT_MUTATION,
//       variables: {
//         client_id: props.client.client_id,
//         responseType: props.responseType,
//         redirectUri: props.redirectUri,
//         scope: props.scope,
//         state: props.state,
//         nonce: props.nonce
//       }
//     })
//     if (data && data.authorizeClient) {
//       if (data.authorizeClient.redirectUri) {
//         window.location.replace(data.authorizeClient.redirectUri)
//         return
//       }
//       if (data.authorizeClient.pendingScopes) {
//         setState({
//           initialized: true,
//           allowedScopes: data.authorizeClient.pendingScopes,
//           pendingScopes: data.authorizeClient.pendingScopes
//         })
//       }
//     }
//   }

//   updateClientScopes = async () => {
//     const { data } = await apolloClient.mutate({
//       mutation: UPDATE_CLIENT_SCOPES_MUTATION,
//       variables: {
//         client_id: props.client.client_id,
//         allowedScopes: allowedScopes,
//         deniedScopes: deniedScopes
//       }
//     })
//     if (data && data.updateClientScopes) {
//       await authorizeClient()
//     }
//   }

//   onDenyClicked = async () => {
//     const query = ['error=consent_required']
//     if (props.state) {
//       query.push(`state=${encodeURIComponent(props.state)}`)
//     }

//     window.location.replace(`${props.redirectUri}?${query.join('&')}`)
//   }

//   onSubmit = async (e) => {
//     e.preventDefault()
//     setState({ isSaving: true })
//     await updateClientScopes()
//     setState({ isSaving: false })
//   }

//   render() {
//     return (
//       <ApolloConsumer>
//         {(apolloClient) => {
//           apolloClient = apolloClient
//           if (!initialized) {
//             return <LoadingIndicator />
//           }
//         }}
//       </ApolloConsumer>
//     )
//   }
// }

export interface IClientAuthorizationProps {
  client: {
    client_id: string
    name: string
    logoImageUrl: string
  }
  responseType: string
  redirectUri: string
  scope: string
  scopes: [{ id: string; userDescription: string; permissionLevel: number; required: boolean }]
  state?: string
  nonce?: string
}

export default ClientAuthorizationComponent
