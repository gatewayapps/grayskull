import { IClient } from '../foundation/types/types'
import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAdministrator } from '../operations/logic/ensureAdministrator'

import { createClient as createClientOperation } from '../operations/data/client/createClient'

export async function createClientActivity(clientData: IClient, context: IRequestContext) {
	ensureAdministrator(context)
	return await createClientOperation(clientData, context.user, context.dataContext)
}
