import { IRequestContext } from '../foundation/context/prepareContext'
import { Permissions } from '../foundation/constants/permissions'
import { GrayskullErrorCode, GrayskullError } from '../foundation/errors/GrayskullError'
import { restore } from '../operations/data/backup/restore'
export async function restoreConfigurationActivity(encryptedBackup: string, context: IRequestContext) {
  if (!context.user || context.user.permissions !== Permissions.Admin) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be an admin to do that')
  } else {
    await restore(encryptedBackup, context.dataContext)
  }
}
