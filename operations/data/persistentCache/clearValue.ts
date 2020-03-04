import Knex from 'knex'
import { IKeyValueCache } from '../../../foundation/types/types'

export async function clearValue(key: string, dataContext: Knex) {
	await dataContext<IKeyValueCache>('KeyValueCache')
		.where({ key })
		.delete()
}
