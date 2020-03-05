import { clearValue } from '../persistentCache/clearValue'
import Knex from 'knex'

export async function clearBackupMultifactorCode(emailAddress: string, dataContext: Knex) {
	const cacheKey = `BACKUP_MFA:${emailAddress}`
	await clearValue(cacheKey, dataContext)
}
