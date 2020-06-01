import Knex from 'knex'
import * as otplib from 'otplib'
import { cacheValue } from '../persistentCache/cacheValue'

export async function generateBackupMultifactorCode(emailAddress: string, otpSecret: string, dataContext: Knex) {
	const cacheKey = `BACKUP_MFA:${emailAddress}`
	const backupCode = otplib.authenticator.generate(otpSecret)

	await cacheValue(cacheKey, backupCode, 30 * 60, dataContext)
	return backupCode
}
