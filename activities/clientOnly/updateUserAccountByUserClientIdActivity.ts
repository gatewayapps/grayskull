import { IUserAccount } from '../../foundation/types/types'
import { IRequestContext } from '../../foundation/context/prepareContext'

import { getUserClientByUserClientId } from '../../operations/data/userClient/getUserClientByUserClientId'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'

import { updateUserAccount } from '../../operations/data/userAccount/updateUserAccount'
import { getAuthorizedUserForClient } from '../../operations/data/client/getAuthorizedUserForClient'
import { getUserAccount } from '../../operations/data/userAccount/getUserAccount'
import { userClientHasAllowedScope } from '../../operations/logic/userClientHasAllowedScope'

export async function updateUserAccountByUserClientIdActivity(
	userClientId: string,
	userData: Partial<IUserAccount>,

	context: IRequestContext
) {
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
		await updateUserAccount(userClient.userAccountId, userData, context.dataContext, context.user, context.cacheContext)

		return getAuthorizedUserForClient(userClient.userClientId, userClient.client_id, context.dataContext)
	} else {
		throw new GrayskullError(GrayskullErrorCode.InvalidUserAccountId, `No user found for sub: ${userClientId}`)
	}
}
