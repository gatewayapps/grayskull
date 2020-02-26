import { IRequestContext } from '../foundation/context/prepareContext'
import { getUserClient } from '../operations/data/userClient/getUserClient'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'

import { createUserClient } from '../operations/data/userClient/createUserClient'
import { updateUserClient } from '../operations/data/userClient/updateUserClient'

import { mergeScopes } from '../operations/logic/mergeScopes'

export async function updateScopesActivity(
  clientId: string,
  allowedScopes: string[],
  deniedScopes: string[],
  context: IRequestContext
) {
  ensureAuthenticated(context)
  const userClient = await getUserClient(context.user!.userAccountId, clientId, context.dataContext)
  if (!userClient) {
    // First time authorization
    await createUserClient(context.user!.userAccountId, clientId, allowedScopes, deniedScopes, context.dataContext)
  } else {
    // Updating an authorization
    const prevAllowedScopes: string[] = JSON.parse(userClient.allowedScopes)
    const prevDeniedScopes: string[] = JSON.parse(userClient.deniedScopes)

    const { allowed, denied } = mergeScopes(prevAllowedScopes, allowedScopes, prevDeniedScopes, deniedScopes)

    await updateUserClient(userClient.userClientId, userClient.userAccountId, allowed, denied, context.dataContext)
  }
}
