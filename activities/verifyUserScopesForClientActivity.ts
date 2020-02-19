import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getClient } from '../operations/data/client/getClient'

import { getUserClient } from '../operations/data/userClient/getUserClient'
import { ScopeMap } from '../foundation/constants/scopes'

export async function verifyUserScopesForClientActivity(clientId: string, scope: string, context: IRequestContext) {
  if (!context.user) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be signed in to do that')
  }

  const client = await getClient(clientId, context.dataContext)
  if (!client) {
    throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `No client exists with id ${clientId}`)
  }

  const clientScopes = JSON.parse(client.scopes)
  const userAccount = context.user

  const requestedScopes: string[] = (scope ? scope.split(/[, ]/) : JSON.parse(client.scopes))
    .filter((s) => clientScopes.includes(s))
    .filter((rs) => ScopeMap[rs].permissionLevel <= userAccount.permissions)

  const userClient = await getUserClient(userAccount.userAccountId, clientId, context.dataContext)

  if (!userClient) {
    return {
      pendingScopes: requestedScopes
    }
  }

  const allowedScopes: string[] = JSON.parse(userClient.allowedScopes)
  const deniedScopes: string[] = JSON.parse(userClient.deniedScopes)
  const pendingScopes = requestedScopes.filter(
    (rs) =>
      !allowedScopes.includes(rs) &&
      !deniedScopes.includes(rs) &&
      ScopeMap[rs].permissionLevel <= userAccount.permissions
  )

  if (pendingScopes.length > 0) {
    return {
      pendingScopes
    }
  }

  return {
    approvedScopes: allowedScopes.filter((allow) => requestedScopes.includes(allow)),
    userClientId: userClient.userClientId
  }
}
