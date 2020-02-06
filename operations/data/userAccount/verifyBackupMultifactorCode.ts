import { getValue } from '../persistentCache/getValue'

export async function verifyBackupMultifactorCode(emailAddress: string, code: string, dataContext: DataContext) {
  const cacheKey = `BACKUP_MFA:${emailAddress}`
  const cacheValue = await getValue(cacheKey, dataContext)
  return cacheValue === code
}
