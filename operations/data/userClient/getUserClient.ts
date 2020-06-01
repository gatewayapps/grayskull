import Knex from 'knex'
import { IUserClient } from '../../../foundation/types/types'

export async function getUserClient(userAccountId: string, client_id: string, dataContext: Knex) {
	return dataContext<IUserClient>('UserClients')
		.where({ userAccountId, client_id })
		.select('*')
		.first()
}
