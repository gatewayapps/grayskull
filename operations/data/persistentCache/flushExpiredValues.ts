import Knex from 'knex'
import { IKeyValueCache } from '../../../foundation/types/types'

export async function flushExpiredValues(dataContext: Knex) {
	await dataContext<IKeyValueCache>('KeyValueCache')
		.where('expires', '<', new Date())
		.delete()
}
