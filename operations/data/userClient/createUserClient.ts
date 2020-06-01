import Knex from 'knex'
import { IUserClient } from '../../../foundation/types/types'
import { v4 as uuidv4 } from 'uuid'

export async function createUserClient(
	userAccountId: string,
	clientId: string,
	allowedScopes: string[],
	deniedScopes: string[],
	dataContext: Knex
) {
	const clientData: Partial<IUserClient> = {
		userAccountId,
		client_id: clientId,
		allowedScopes: JSON.stringify(allowedScopes),
		deniedScopes: JSON.stringify(deniedScopes),
		createdAt: new Date(),
		createdBy: userAccountId,
		updatedAt: new Date(),
		userClientId: uuidv4()
	}

	await dataContext<IUserClient>('UserClients').insert(clientData)
	return await dataContext<IUserClient>('UserClients')
		.where({ userClientId: clientData.userClientId })
		.select('*')
		.first()
}
