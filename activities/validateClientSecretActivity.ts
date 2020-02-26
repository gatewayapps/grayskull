import { IRequestContext } from '../foundation/context/prepareContext'
import { getClient } from '../operations/data/client/getClient'

export async function validateClientSecretActivity(clientId: string, secret: string, context: IRequestContext) {
	const client = await getClient(clientId, context.dataContext, true)
	return client && client.secret === secret
}
