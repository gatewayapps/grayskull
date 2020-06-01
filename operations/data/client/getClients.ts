import Knex from 'knex'
import { IClient } from '../../../foundation/types/types'

export async function getClients(
	offset: number,
	limit: number,

	dataContext: Knex
) {
	const clientRecords = await dataContext<IClient>('Clients')
		.select('*')
		.orderBy('name', 'asc')
		.offset(offset)
		.limit(limit)

	return clientRecords.map((cr) => {
		delete cr.secret
		return cr
	})
}
