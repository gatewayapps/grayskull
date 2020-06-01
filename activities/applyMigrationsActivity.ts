import { IRequestContext } from '../foundation/context/prepareContext'
import { applyMigrations } from '../operations/data/migrations/applyMigrations'

export async function applyMigrationsActivity(context: IRequestContext) {
	await applyMigrations(context.dataContext)
}
