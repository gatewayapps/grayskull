import { DataContext } from '../../../foundation/context/getDataContext'
import { clearValue } from '../persistentCache/clearValue'

export async function clearBackupMultifactorCode(emailAddress: string, dataContext: DataContext) {
	const cacheKey = `BACKUP_MFA:${emailAddress}`
	await clearValue(cacheKey, dataContext)
}
