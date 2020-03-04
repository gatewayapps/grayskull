import Knex from 'knex'

export async function flushExpiredValues(dataContext: Knex) {
	await dataContext.where('expires', '<', new Date()).delete()
}
