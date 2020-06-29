import { deleteUserAccount } from '../../operations/data/userAccount/deleteUserAccount'
import { getUserClientByUserClientId } from '../../operations/data/userClient/getUserClientByUserClientId'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { userClientHasAllowedScope } from '../../operations/logic/userClientHasAllowedScope'
import { getUserAccount } from '../../operations/data/userAccount/getUserAccount'

import { IRequestContext } from '../../foundation/context/prepareContext'

export async function deactivateUserAccountByUserClientIdActivity(userClientId: string, context: IRequestContext) {
	const userClient = await getUserClientByUserClientId(userClientId, context.dataContext)
	if (!userClient) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `User has not authorized this client`)
	}

	if (!userClientHasAllowedScope(userClient, 'admin-profile:write')) {
		throw new GrayskullError(
			GrayskullErrorCode.NotAuthorized,
			'User has not allowed this client to update their profile'
		)
	}

	const existingUser = await getUserAccount(userClient.userAccountId, context.dataContext)
	if (existingUser) {
		await deleteUserAccount(userClient.userAccountId, context.user, context.dataContext)
	} else {
		throw new Error('Unable to delete user.  Already deleted')
	}
}
