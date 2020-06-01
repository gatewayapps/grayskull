import Knex from 'knex'
import { IUserClient } from '../../../foundation/types/types'

export async function updateUserClient(
	userClientId: string,
	userAccountId: string,
	allowedScopes: string[],
	deniedScopes: string[],
	dataContext: Knex
) {
	await dataContext<IUserClient>('UserClients')
		.where({ userClientId })
		.update({
			allowedScopes: JSON.stringify(allowedScopes),
			deniedScopes: JSON.stringify(deniedScopes),
			updatedAt: new Date(),
			updatedBy: userAccountId
		})
}
