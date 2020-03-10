import Knex from 'knex'
import { MigrationSource } from '../../services/migrations/migrationSource'

export async function applyMigrations(dataContext: Knex) {
	await dataContext.migrate.latest({ migrationSource: new MigrationSource(), disableMigrationsListValidation: true })
}
