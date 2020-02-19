import { IRequestContext } from '../foundation/context/prepareContext'
import { getUserClient } from '../operations/data/userClient/getUserClient'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'

import { createUserClient } from '../operations/data/userClient/createUserClient'
import { updateUserClient } from '../operations/data/userClient/updateUserClient'
import _ from 'lodash'

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

    // add new denied to previous denied
    const newDeniedScopes = _.uniq(prevDeniedScopes.concat(deniedScopes)).filter(
      (denied) => !allowedScopes.includes(denied)
    )
    const newAllowedScopes = _.uniq(prevAllowedScopes.concat(allowedScopes)).filter(
      (allowed) => !newDeniedScopes.includes(allowed)
    )

    await updateUserClient(
      userClient.userClientId,
      userClient.userAccountId,
      newAllowedScopes,
      newDeniedScopes,
      context.dataContext
    )
  }
}
