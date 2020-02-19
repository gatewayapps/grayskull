import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { getClient } from '../operations/data/client/getClient'

export async function getClientByIdActivity(clientId: string, context: IRequestContext) {
  ensureAuthenticated(context)
  return getClient(clientId, context.dataContext, false)
}
