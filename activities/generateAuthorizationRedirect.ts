import { IRequestContext } from '../foundation/context/prepareContext'

import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getUserClient } from '../operations/data/userClient/getUserClient'
import { getClient } from '../operations/data/client/getClient'
import { isValidClientRedirectUri } from '../operations/logic/isValidClientRedirectUri'
import { createAccessToken } from '../operations/logic/createAccessToken'
import { ScopeMap } from '../server/api/services/ScopeService'
import { createIDToken } from '../operations/logic/createIDToken'
import { generateAuthorizationCode } from '../operations/data/userAccount/generateAuthorizationCode'

const VALID_RESPONSE_TYPES = ['code', 'token', 'id_token', 'none']

export async function generateAuthorizationRedirect(
  clientId: string,
  responseTypes: string[],
  redirectUri: string,
  state: string,
  nonce: string,
  context: IRequestContext
) {
  if (!context.user) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be signed in to do that')
  }

  if (!responseTypes.every((rt) => VALID_RESPONSE_TYPES.includes(rt))) {
    throw new GrayskullError(GrayskullErrorCode.InvalidResponseType, 'Invalid response type')
  }
  const client = await getClient(clientId, context.dataContext)
  if (!client) {
    throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `No such client exists ${clientId}`)
  }

  const userClient = await getUserClient(context.user.userAccountId, clientId, context.dataContext)
  if (!userClient) {
    throw new GrayskullError(
      GrayskullErrorCode.NotAuthorized,
      `User ${context.user.userAccountId} has not authorized client ${clientId}`
    )
  }

  if (!isValidClientRedirectUri(client, redirectUri)) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid redirect uri`)
  }

  const queryParts: any = {}
  const userClientAllowsScopes = JSON.parse(userClient.allowedScopes)

  if (responseTypes.includes('code')) {
    queryParts.code = await generateAuthorizationCode(
      clientId,
      userClientAllowsScopes,
      userClient.userClientId,
      nonce,
      context.user,
      context.dataContext
    )
  }

  if (responseTypes.includes('token')) {
    const config = context.configuration

    queryParts.token = await createAccessToken(client, userClient, undefined, context.configuration)
    queryParts.token_type = 'Bearer'
    queryParts.expires_in = config.Security.accessTokenExpirationSeconds
  }
  if (responseTypes.includes('id_token') && userClientAllowsScopes.includes(ScopeMap.openid.id)) {
    queryParts.id_token = await createIDToken(
      context.user,
      client,
      userClient,
      nonce,
      queryParts.token,
      context.configuration
    )
  }

  const query = Object.keys(queryParts).map((k) => `${k}=${encodeURIComponent(queryParts[k])}`)

  if (state) {
    query.push(`state=${encodeURIComponent(state)}`)
  }

  return `${redirectUri}${query.length > 0 ? '?' + query.join('&') : ''}`
}
