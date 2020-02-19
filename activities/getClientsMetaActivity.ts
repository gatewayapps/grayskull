import { IClientFilter, IClientMeta } from '../foundation/types/filterTypes'
import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { countClients } from '../operations/data/client/countClients'

export async function getClientsMetaActivity(filter: IClientFilter, context: IRequestContext): Promise<IClientMeta> {
  ensureAdministrator(context)
  const count = await countClients(filter, context.dataContext)
  return {
    count
  }
}
