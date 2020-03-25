import { IUserAccount } from '../../foundation/types/types'
import { IRequestContext } from '../../foundation/context/prepareContext'

import { getUserClientByUserClientId } from '../../operations/data/userClient/getUserClientByUserClientId'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { updateUserAccountActivity } from '../updateUserAccountActivity'

export async function updateUserAccountByUserClientIdActivity(
	userClientId: string,
	userData: Partial<IUserAccount>,
	context: IRequestContext
) {
	const userClient = await getUserClientByUserClientId(userClientId, context.dataContext)
	if (!userClient) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `User has not authorized this client`)
	}

	return await updateUserAccountActivity(userClient.userAccountId, userData, context)
}
