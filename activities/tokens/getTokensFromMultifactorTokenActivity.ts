import { IRequestContext } from '../../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'

import { getUserAccountByUserClientId } from '../../operations/data/userAccount/getUserAccountByUserClientId'
import { GrantTypes } from '../../foundation/constants/grantTypes'
import { verifyBackupMultifactorCode } from '../../operations/data/userAccount/verifyBackupMultifactorCode'
import { getTokensActivity } from './getTokensActivity'
import { verifyOtpTokenActivity } from '../verifyOtpTokenActivity'
import { getClient } from '../../operations/data/client/getClient'
import { verifyTokenForClient } from '../../operations/logic/verifyTokenForClient'
import { IChallengeToken } from '../../foundation/types/tokens'

export async function getTokensFromMultifactorTokenActivity(
	clientId: string,

	otpToken: string,
	challengeToken: string,
	context: IRequestContext
) {
	const client = await getClient(clientId, context.dataContext, true)
	if (!client) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, 'No client found with that id')
	}

	const challengeTokenObject = await verifyTokenForClient(challengeToken, client, context.dataContext)
	if (!challengeTokenObject) {
		return {
			challenge: {
				challenge_token: challengeToken,
				challenge_type: GrantTypes.MultifactorToken.id
			}
		}
	}

	const userAccount = await getUserAccountByUserClientId(
		(challengeTokenObject as IChallengeToken).userClientId,
		context.dataContext
	)
	if (!userAccount) {
		throw new GrayskullError(GrayskullErrorCode.InvalidAuthorizeRequest, 'No user found for challenge token')
	}

	if (!userAccount.otpEnabled || !userAccount.otpSecret) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidAuthorizeRequest,
			`Attempted to authorize using ${GrantTypes.MultifactorToken.id} on user without ${GrantTypes.MultifactorToken.name} enabled`
		)
	}

	if (
		!verifyOtpTokenActivity(otpToken, userAccount.otpSecret) &&
		!(await verifyBackupMultifactorCode(
			(challengeTokenObject as IChallengeToken).emailAddress,
			otpToken,
			context.dataContext
		))
	) {
		throw new GrayskullError(GrayskullErrorCode.InvalidOTP, `Token is incorrect`)
	}

	return getTokensActivity(
		userAccount.userAccountId,
		clientId,
		(challengeTokenObject as IChallengeToken).scopes,
		context
	)
}
