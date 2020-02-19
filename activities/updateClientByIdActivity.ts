import { IClient } from '../foundation/types/types'
import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { updateClient } from '../operations/data/client/updateClient'

export async function updateClientByIdActivity(clientId: string, values: IClient, context: IRequestContext) {
  ensureAdministrator(context)
  await updateClient(clientId, values, context.user, context.dataContext)
}
