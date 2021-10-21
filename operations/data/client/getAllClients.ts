import Knex from 'knex'
import { IClient } from '../../../foundation/types/types'

export async function getAllClients(dataContext: Knex) {
	const clientRecords = await dataContext<IClient>('Clients')
		.select('*')
		.orderBy('name', 'asc')

	return clientRecords.map((cr) => {
		delete cr.secret
		return cr
	})
}
