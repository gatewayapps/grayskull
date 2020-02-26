import { randomBytes } from 'crypto'
import { cacheValue } from '../operations/data/persistentCache/cacheValue'
import { Permissions } from '../foundation/constants/permissions'
import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'

export async function generateBackupCodeActivity(context: IRequestContext) {
	if (!context.user || context.user.permissions !== Permissions.Admin) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be an admin to do that')
	} else {
		const code = randomBytes(32).toString('hex')
		const cacheKey = `BACKUP_CODE`

		await cacheValue(cacheKey, code, 10, context.dataContext)
		return code
	}
}
