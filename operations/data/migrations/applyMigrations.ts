import Knex, { MigratorConfig } from 'knex'
import { MigrationSource } from '../../services/migrations/migrationSource'

export async function applyMigrations(dataContext: Knex, tryTimes = 1) {
	const migrationOptions: MigratorConfig = {
		migrationSource: new MigrationSource()
	}

	const attempt = 1
	while (attempt <= tryTimes) {
		try {
			await dataContext.migrate.latest(migrationOptions)

			return
		} catch (err) {
			console.error(`Migration attempt ${attempt} failed.  Trying ${tryTimes - attempt} more times`)
		}
	}
}
