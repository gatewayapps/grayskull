import Knex, { MigratorConfig } from 'knex'
import { MigrationSource } from '../../services/migrations/migrationSource'

export async function applyMigrations(dataContext: Knex) {
	const migrationOptions: MigratorConfig = {
		migrationSource: new MigrationSource(),
		disableTransactions: false
	}
	try {
		await dataContext.migrate.latest(migrationOptions)
	} catch (err) {
		await dataContext.migrate.rollback(migrationOptions)
	}
}
