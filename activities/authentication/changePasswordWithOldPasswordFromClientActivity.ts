import { IRequestContext } from '../../foundation/context/prepareContext'
import { getUserClientByUserClientId } from '../../operations/data/userClient/getUserClientByUserClientId'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { changePasswordWithOldPasswordActivity } from './changePasswordWithOldPasswordActivity'
import { ensureAuthenticated } from '../../operations/logic/ensureAuthenticated'

export async function changePasswordFromClientActivity(
	userClientId: string,
	oldPassword: string,
	newPassword: string,
	context: IRequestContext
) {
	ensureAuthenticated(context)
	const userClient = await getUserClientByUserClientId(userClientId, context.dataContext)
	if (!userClient) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `User has not authorized this client`)
	}

	if (userClient.userAccountId !== context.user!.userAccountId) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `You can't change another users password`)
	}

	return await changePasswordWithOldPasswordActivity(oldPassword, newPassword, newPassword, context)
}
