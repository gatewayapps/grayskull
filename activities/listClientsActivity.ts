import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'
import { IClientFilter } from '../foundation/types/filterTypes'
import { getClients } from '../operations/data/client/getClients'

export async function listClientsActivity(filter: IClientFilter, skip: number, take: number, context: IRequestContext) {
	ensureAdministrator(context)
	return getClients(skip, take, context.dataContext)
}
