import { IUserAccount } from '../../foundation/types/types'
import { IRequestContext } from '../../foundation/context/prepareContext'

import { getUserClientByUserClientId } from '../../operations/data/userClient/getUserClientByUserClientId'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'

import { updateUserAccount } from '../../operations/data/userAccount/updateUserAccount'
import { getAuthorizedUserForClient } from '../../operations/data/client/getAuthorizedUserForClient'

export async function updateUserAccountByUserClientIdActivity(
	userClientId: string,
	userData: Partial<IUserAccount>,
	context: IRequestContext
) {
	const userClient = await getUserClientByUserClientId(userClientId, context.dataContext)
	if (!userClient) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `User has not authorized this client`)
	}

	await updateUserAccount(userClient.userAccountId, userData, context.dataContext, context.user, context.cacheContext)
	return getAuthorizedUserForClient(userClient.userClientId, userClient.client_id, context.dataContext)
}
