import { IRequestContext } from '../foundation/context/prepareContext'
import { validateClientSecretActivity } from './validateClientSecretActivity'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'

import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { verifyPassword } from '../operations/data/userAccount/verifyPassword'

import { getTokensActivity } from './getTokensActivity'
import { IAccessTokenResponse } from '../foundation/types/tokens'
import { createChallengeToken } from '../operations/logic/createChallengeToken'
import { getUserClient } from '../operations/data/userClient/getUserClient'
import { createUserClient } from '../operations/data/userClient/createUserClient'
import { getClient } from '../operations/data/client/getClient'
import { GrantTypes } from '../foundation/constants/grantTypes'

export async function getTokensFromPasswordActivity(
	clientId: string,
	clientSecret: string,
	emailAddress: string,
	password: string,
	scopes: string[],
	context: IRequestContext
): Promise<IAccessTokenResponse> {
	if (!(await validateClientSecretActivity(clientId, clientSecret, context))) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Failed to validate client`)
	}

	const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, undefined, false)
	if (!userAccount) {
		throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `No user found with that email address`)
	}

	const passwordVerified = await verifyPassword(userAccount.userAccountId, password, context.dataContext)
	if (!passwordVerified) {
		throw new GrayskullError(GrayskullErrorCode.IncorrectPassword, `Incorrect password`)
	}

	if (userAccount.otpEnabled && userAccount.otpSecret) {
		let userClient = await getUserClient(userAccount.userAccountId, clientId, context.dataContext)
		if (!userClient) {
			// User has never authorized this client, we should manually authorize all scopes
			const client = await getClient(clientId, context.dataContext, false)

			userClient = await createUserClient(
				userAccount.userAccountId,
				clientId,
				JSON.parse(client!.scopes),
				[],
				context.dataContext
			)
			if (!userClient) {
				throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'Something went wrong with authorizing the client.')
			}
		}

		const token = await createChallengeToken(
			userClient.userClientId,
			JSON.parse(userClient.allowedScopes),
			clientSecret
		)
		return {
			challenge: {
				token,
				type: GrantTypes.MultifactorToken.id
			}
		}
	} else {
		return getTokensActivity(userAccount.userAccountId, clientId, scopes, context)
	}
}
