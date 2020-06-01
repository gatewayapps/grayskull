import Knex from 'knex'
import { IUserClient } from '../../../foundation/types/types'

export async function getUserClientByUserClientId(userClientId: string, context: Knex) {
	return context<IUserClient>('UserClients')
		.where({ userClientId })
		.select('*')
		.first()
}
