import { IRequestContext } from '../../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { getUserAccountByEmailAddress } from '../../operations/data/userAccount/getUserAccountByEmailAddress'
import { verifyPassword } from '../../operations/data/userAccount/verifyPassword'
import { getTokensActivity } from './getTokensActivity'
import { IAccessTokenResponse } from '../../foundation/types/tokens'
import { createChallengeToken } from '../../operations/logic/createChallengeToken'
import { getUserClient } from '../../operations/data/userClient/getUserClient'
import { createUserClient } from '../../operations/data/userClient/createUserClient'
import { getClient } from '../../operations/data/client/getClient'
import { GrantTypes } from '../../foundation/constants/grantTypes'

import { updateUserClient } from '../../operations/data/userClient/updateUserClient'

export async function getTokensFromPasswordActivity(
	clientId: string,
	emailAddress: string,
	password: string,
	scopes: string[],
	context: IRequestContext
): Promise<IAccessTokenResponse> {
	const client = await getClient(clientId, context.dataContext, true)
	if (!client) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, 'No client found with that id')
	}

	const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, undefined, true)
	if (!userAccount) {
		throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `No user found with that email address`)
	}

	const passwordVerified = await verifyPassword(userAccount.userAccountId, password, context.dataContext)
	if (!passwordVerified) {
		throw new GrayskullError(GrayskullErrorCode.IncorrectPassword, `Incorrect password`)
	}

	let userClient = await getUserClient(userAccount.userAccountId, clientId, context.dataContext)
	if (!userClient) {
		// User has never authorized this client, we should manually authorize all scopes

		userClient = await createUserClient(
			userAccount.userAccountId,
			clientId,
			JSON.parse(client.scopes),
			[],
			context.dataContext
		)
		if (!userClient) {
			throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'Something went wrong with authorizing the client.')
		}
	}

	if (userAccount.otpEnabled && userAccount.otpSecret) {
		const token = await createChallengeToken(
			emailAddress,
			userClient.userClientId,
			JSON.parse(client.scopes),
			client,
			context.dataContext
		)
		return {
			challenge: {
				challenge_token: token,
				challenge_type: GrantTypes.MultifactorToken.id
			}
		}
	} else {
		await updateUserClient(
			userClient.userClientId,
			userClient.userAccountId,
			JSON.parse(client.scopes),
			[],
			context.dataContext
		)

		return getTokensActivity(userAccount.userAccountId, clientId, JSON.parse(client.scopes), context)
	}
}
