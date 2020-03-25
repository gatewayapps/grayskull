import { IRequestContext } from '../../foundation/context/prepareContext'
import { createUserClient } from '../../operations/data/userClient/createUserClient'
import { getAuthorizedUserForClient } from '../../operations/data/client/getAuthorizedUserForClient'
import { getClient } from '../../operations/data/client/getClient'
import { getUserAccount } from '../../operations/data/userAccount/getUserAccount'
import { GrayskullErrorCode, GrayskullError } from '../../foundation/errors/GrayskullError'

export async function authorizeClientForUserAccountActivity(
	userAccountId: string,
	clientId: string,
	context: IRequestContext
) {
	const client = await getClient(clientId, context.dataContext, false)
	const userAccount = await getUserAccount(userAccountId, context.dataContext, undefined, false)
	if (!client) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `No client found for id ${clientId}`)
	}
	if (!userAccount) {
		throw new GrayskullError(GrayskullErrorCode.InvalidUserAccountId, `No user account found for ${userAccountId}`)
	}

	const userClient = await createUserClient(
		userAccount.userAccountId,
		clientId,
		JSON.parse(client.scopes),
		[],
		context.dataContext
	)
	if (!userClient) {
		throw new Error('Failed to create user client')
	}

	return await getAuthorizedUserForClient(userClient?.userClientId, clientId, context.dataContext)
}
