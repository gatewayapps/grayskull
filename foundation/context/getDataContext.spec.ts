import Knex from 'knex'
import { getDataContext } from './getDataContext'

import { applyMigrations } from '../../operations/data/migrations/applyMigrations'

export async function getInMemoryContext() {
	const options: Knex.Config = {
		debug: false,
		client: 'sqlite',
		connection: {
			database: 'grayskull',
			filename: ':memory:'
		},
		useNullAsDefault: true
	}

	const context = await getDataContext(options)

	await applyMigrations(context)
	//await context.migrate.up({ migrationSource: new MigrationSource(), disableMigrationsListValidation: true })
	return context
}

describe('getDataContext', () => {
	it('should correctly return a data context', async () => {
		const dc = await getInMemoryContext()

		expect(dc).toBeDefined()
	})
})
