import { IRequestContext } from '../../foundation/context/prepareContext'
import { ensureAdministrator } from '../../operations/logic/ensureAdministrator'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { deleteUserAccount } from '../../operations/data/userAccount/deleteUserAccount'

export async function deleteUserAccountActivity(userAccountId: string, context: IRequestContext) {
	ensureAdministrator(context)
	if (userAccountId === context.user!.userAccountId) {
		throw new GrayskullError(GrayskullErrorCode.InvalidUserAccountId, 'You cannot delete yourself')
	}

	await deleteUserAccount(userAccountId, context.user!, context.dataContext)
}
