import { addSeconds } from 'date-fns'
import { clearValue } from './clearValue'
import Knex from 'knex'
import { IKeyValueCache } from '../../../foundation/types/types'

export async function cacheValue(key: string, value: string, ttlSeconds: number, dataContext: Knex) {
	await clearValue(key, dataContext)

	const expires = addSeconds(new Date(), ttlSeconds)

	await dataContext<IKeyValueCache>('KeyValueCache').insert({ key, value, expires })
}
