import { flushExpiredValues } from './flushExpiredValues'
import Knex from 'knex'
import { IKeyValueCache } from '../../../foundation/types/types'

export async function getValue(key: string, dataContext: Knex) {
	await flushExpiredValues(dataContext)
	const record = await dataContext<IKeyValueCache>('KeyValueCache')
		.where({ key })
		.select(['value'])
		.first()

	return record ? record.value : undefined
}

export async function getRecord(key: string, dataContext: Knex) {
	await flushExpiredValues(dataContext)
	const record = await dataContext<IKeyValueCache>('KeyValueCache')
		.debug(true)
		.where({ key })
		.select('*')
		.first()

	return record
}
