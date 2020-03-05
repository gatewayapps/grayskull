import Knex from 'knex'
import { IClient } from '../../../foundation/types/types'

export async function getPinnedClients(dataContext: Knex) {
	return dataContext<IClient>('Clients')
		.where({ pinToHeader: true })
		.select('baseUrl', 'client_id', 'homePageUrl', 'logoImageUrl', 'name', 'pinToHeader')
}
