import { IRequestContext } from '../../foundation/context/prepareContext'
import { Permissions } from '../../foundation/constants/permissions'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'

export async function ensureAdministrator(context: IRequestContext) {
  if (!context.user || context.user.permissions !== Permissions.Admin) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'You must be an admin to do that')
  }
}
