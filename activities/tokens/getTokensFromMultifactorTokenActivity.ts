import * as otplib from 'otplib'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { validateClientSecretActivity } from '../validateClientSecretActivity'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { verifyChallengeToken } from '../../operations/logic/verifyChallengeToken'
import { getUserAccountByUserClientId } from '../../operations/data/userAccount/getUserAccountByUserClientId'
import { GrantTypes } from '../../foundation/constants/grantTypes'
import { verifyBackupMultifactorCode } from '../../operations/data/userAccount/verifyBackupMultifactorCode'
import { getTokensActivity } from './getTokensActivity'
import { verifyOtpTokenActivity } from '../verifyOtpTokenActivity'

export async function getTokensFromMultifactorTokenActivity(
	clientId: string,
	clientSecret: string,
	otpToken: string,
	challengeToken: string,
	context: IRequestContext
) {
	if (!(await validateClientSecretActivity(clientId, clientSecret, context))) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Failed to validate client`)
	}

	const challengeTokenObject = await verifyChallengeToken(challengeToken, clientSecret)
	if (!challengeTokenObject) {
		return {
			challenge: {
				challenge_token: challengeToken,
				challenge_type: GrantTypes.MultifactorToken.id
			}
		}
	}

	const userAccount = await getUserAccountByUserClientId(challengeTokenObject.userClientId, context.dataContext)
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
		!(await verifyBackupMultifactorCode(challengeTokenObject.emailAddress, otpToken, context.dataContext))
	) {
		throw new GrayskullError(GrayskullErrorCode.InvalidOTP, `Token is incorrect`)
	}

	return getTokensActivity(userAccount.userAccountId, clientId, challengeTokenObject.scopes, context)
}
