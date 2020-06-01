import { IClientFilter } from '../../../foundation/types/filterTypes'
import Knex from 'knex'
import { IClient } from '../../../foundation/types/types'

export async function countClients(filter: IClientFilter, dataContext: Knex) {
	const results = await dataContext<IClient>('Clients').count('*', { as: 'clientCount' })
	if (!results || results.length === 0) {
		throw new Error('Unknown')
	}
	return results[0]['clientCount'] as number
}
