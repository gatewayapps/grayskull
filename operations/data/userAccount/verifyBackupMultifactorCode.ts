import { getValue } from '../persistentCache/getValue'
import Knex from 'knex'

export async function verifyBackupMultifactorCode(emailAddress: string, code: string, dataContext: Knex) {
	const cacheKey = `BACKUP_MFA:${emailAddress}`
	const cacheValue = await getValue(cacheKey, dataContext)
	return cacheValue === code
}
