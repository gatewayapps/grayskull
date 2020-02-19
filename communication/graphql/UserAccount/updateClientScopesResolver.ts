import { IRequestContext } from '../../../foundation/context/prepareContext'

import { updateScopesActivity } from '../../../activities/updateScopesActivity'

export async function updateClientScopesResolver(obj, args, context: IRequestContext) {
  const { client_id, allowedScopes, deniedScopes } = args.data
  await updateScopesActivity(client_id, allowedScopes, deniedScopes, context)

  return true
}
