import { IRequestContext } from '../foundation/context/prepareContext'
import { validateClientSecretActivity } from './validateClientSecretActivity'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'

import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { verifyPassword } from '../operations/data/userAccount/verifyPassword'

import { getTokensActivity } from './getTokensActivity'

export async function getTokensFromPasswordActivity(
	clientId: string,
	clientSecret: string,
	emailAddress: string,
	password: string,
	scopes: string[],
	context: IRequestContext
) {
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
		throw new GrayskullError(GrayskullErrorCode.RequiresOTP, `Login requires a OTP password`)
	}
	return getTokensActivity(userAccount.userAccountId, clientId, scopes, context)
}
