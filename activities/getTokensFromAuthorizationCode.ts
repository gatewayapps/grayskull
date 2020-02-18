import { getValue } from '../operations/data/persistentCache/getValue'
import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { clearValue } from '../operations/data/persistentCache/clearValue'
import { getUserAccount } from '../operations/data/userAccount/getUserAccount'
import { ScopeMap } from '../foundation/constants/scopes'
import { IAccessTokenResponse } from '../foundation/types/tokens'

import { validateClientSecret } from './validateClientSecret'
import { getClient } from '../operations/data/client/getClient'
import { createIDToken } from '../operations/logic/createIDToken'
import { createUserContextForUserId } from '../foundation/context/getUserContext'
import { getUserClient } from '../operations/data/userClient/getUserClient'
import { createRefreshToken } from '../operations/data/refreshToken/createRefreshToken'
import { createAccessToken } from '../operations/logic/createAccessToken'
import { IRefreshToken } from '../foundation/types/types'

/**
 * getTokens flow
 * 1. Validate the client and grant_type
 * 2. Verify the authorization code
 * 3. Lookup user from authorization code
 * 4. Get client and user client from db
 * 5. If id_token scope is allowed, create it
 * 6. If offline_access is allowed, create refresh_token
 * 7. Create an access_token
 */
export async function getTokensFromAuthorizationCode(
  clientId: string,
  clientSecret: string,
  code: string,
  context: IRequestContext
): Promise<IAccessTokenResponse> {
  let id_token: string | undefined = undefined
  let refresh_token: IRefreshToken | undefined = undefined

  if (!(await validateClientSecret(clientId, clientSecret, context))) {
    throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Failed to validate client`)
  }

  const codeStringValue = await getValue(code, context.dataContext)
  if (!codeStringValue) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `authorization_code has expired`)
  }

  const authCodeCacheResult = JSON.parse(codeStringValue)
  await clearValue(code, context.dataContext)

  if (!authCodeCacheResult) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `authorization_code has expired`)
  }

  const userAccount = await getUserAccount(authCodeCacheResult.userAccount.userAccountId, context.dataContext)
  if (!userAccount) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidUserAccountId,
      `User account not found: ${authCodeCacheResult.userAccount.userAccountId}`
    )
  }
  const userContext = await createUserContextForUserId(
    userAccount.userAccountId,
    context.dataContext,
    context.cacheContext,
    context.configuration
  )

  if (!userContext) {
    throw new GrayskullError(
      GrayskullErrorCode.NotAuthorized,
      `Unable to build user context for ${userAccount.userAccountId}`
    )
  }

  const client = await getClient(clientId, context.dataContext, true)
  if (!client) {
    throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Unable to find client for ${clientId}`)
  }

  const userClient = await getUserClient(userAccount.userAccountId, clientId, context.dataContext)
  if (!userClient) {
    throw new GrayskullError(
      GrayskullErrorCode.NotAuthorized,
      `User ${userAccount.userAccountId} has not authorized client ${clientId}`
    )
  }

  if (authCodeCacheResult.scope.includes(ScopeMap.openid.id)) {
    id_token = await createIDToken(
      userContext,
      client,
      userClient,
      authCodeCacheResult.nonce,
      undefined,
      context.configuration
    )
  }

  if (authCodeCacheResult.scope.includes(ScopeMap.offline_access.id)) {
    refresh_token = await createRefreshToken(client.secret, userClient.userClientId, undefined, context.dataContext)
  }

  const access_token = await createAccessToken(client, userClient, refresh_token, context.configuration)
  return {
    access_token,
    id_token,
    expires_in: context.configuration.Security.accessTokenExpirationSeconds || 300,
    refresh_token: refresh_token ? refresh_token.token : undefined,
    token_type: 'Bearer'
  }
}
