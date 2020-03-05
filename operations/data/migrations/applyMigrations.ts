import Knex from 'knex'

export async function applyMigrations(dataContext: Knex) {
	await dataContext.migrate.up({ directory: './foundation/migrations', extension: '.ts' })
}
