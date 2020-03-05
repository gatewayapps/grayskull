import Knex from 'knex'
import { IClient } from '../../../foundation/types/types'

export async function getClient(clientId: string, dataContext: Knex, includeSensitive = false) {
	const result = await dataContext<IClient>('Clients')
		.where({ clientId })
		.select('*')
		.first()
	if (result && !includeSensitive) {
		delete result.secret
	}

	return result
}
