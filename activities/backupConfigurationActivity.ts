import { backup } from '../operations/data/backup/backup'

import { getValue } from '../operations/data/persistentCache/getValue'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { clearValue } from '../operations/data/persistentCache/clearValue'
import { IRequestContext } from '../foundation/context/prepareContext'

export async function backupConfigurationActivity(code: string, context: IRequestContext) {
	/*
	 * 1. Verify backup code is valid
	 * 2. Clear backup code from cache
	 * 3. Generate backup string and return it
	 */

	const cachedValue = await getValue('BACKUP_CODE', context.dataContext)
	if (!cachedValue || cachedValue !== code) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidBackupCode,
			'Attempted to download a backup with an invalid backup code'
		)
	} else {
		await clearValue('BACKUP_CODE', context.dataContext)
		const encryptedBackup = await backup(context.dataContext)
		return encryptedBackup
	}
}
