import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { getPinnedClients } from '../operations/data/client/getPinnedClients'

export async function getPinnedClientsActivity(context: IRequestContext) {
  ensureAuthenticated(context)
  return await getPinnedClients(context.dataContext)
}
