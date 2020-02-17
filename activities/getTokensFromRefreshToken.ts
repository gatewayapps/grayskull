import { validateClientSecret } from './validateClientSecret'
import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getRefreshTokenFromRawToken } from '../operations/data/refreshToken/getRefreshTokenFromRawToken'
import { getClient } from '../operations/data/client/getClient'
import { getUserClientByUserClientId } from '../operations/data/userClient/getUserClientByUserClientId'
import { userClientHasAllowedScope } from '../operations/logic/userClientHasAllowedScope'
import { ScopeMap } from '../foundation/constants/scopes'
import { createIDToken } from '../operations/logic/createIDToken'
import { createUserContextForUserId } from '../foundation/context/getUserContext'
import { createAccessToken } from '../operations/logic/createAccessToken'
import { updateRefreshTokenActiveAt } from '../operations/data/refreshToken/refreshAccessToken'
import { IAccessTokenResponse } from '../foundation/types/tokens'

export async function getTokensFromRefreshToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  context: IRequestContext
): Promise<IAccessTokenResponse> {
  let id_token: string | undefined = undefined
  if (!(await validateClientSecret(clientId, clientSecret, context))) {
    throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Failed to validate client`)
  }

  const client = await getClient(clientId, context.dataContext, true)
  if (!client) {
    throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Unable to find client ${clientId}`)
  }

  const finalRefreshToken = await getRefreshTokenFromRawToken(refreshToken, client, context.dataContext)
  if (!finalRefreshToken) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid refresh token ${refreshToken}`)
  }

  const userClient = await getUserClientByUserClientId(finalRefreshToken.userClientId, context.dataContext)
  if (!userClient) {
    throw new GrayskullError(
      GrayskullErrorCode.NotAuthorized,
      `UserClient does not exist: ${finalRefreshToken.userClientId}`
    )
  }

  const userContext = await createUserContextForUserId(
    userClient.userAccountId,
    context.dataContext,
    context.cacheContext
  )
  if (!userContext) {
    throw new GrayskullError(
      GrayskullErrorCode.NotAuthorized,
      `Unable to build user context for ${userClient.userAccountId}`
    )
  }

  if (userClientHasAllowedScope(userClient, ScopeMap.openid.id)) {
    id_token = await createIDToken(userContext, client, userClient, undefined, undefined, context.configuration)
  }

  const access_token = await createAccessToken(client, userClient, finalRefreshToken, context.configuration)
  await updateRefreshTokenActiveAt(refreshToken, client, context.dataContext)

  return {
    access_token,
    id_token,
    expires_in: context.configuration.Security.accessTokenExpirationSeconds || 300,
    refresh_token: finalRefreshToken ? finalRefreshToken.token : undefined,
    token_type: 'Bearer'
  }
}
