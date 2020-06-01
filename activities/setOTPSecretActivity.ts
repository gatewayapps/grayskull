import { IRequestContext } from '../foundation/context/prepareContext'
import { verifyPassword } from '../operations/data/userAccount/verifyPassword'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { encrypt } from '../operations/logic/encryption'
import { setUserAccountOTPSecret } from '../operations/data/userAccount/setUserAccountOTPSecret'

export async function setOTPSecretActivity(password: string, otpSecret: string, context: IRequestContext) {
	ensureAuthenticated(context)
	if (!(await verifyPassword(context.user!.userAccountId, password, context.dataContext))) {
		throw new GrayskullError(GrayskullErrorCode.IncorrectPassword, 'Your password is not correct')
	}

	if (!otpSecret && context.configuration.Security.multifactorRequired) {
		throw new GrayskullError(
			GrayskullErrorCode.MultifactorRequired,
			`${context.configuration.Server.realmName} security policy requires that you have an Authenticator App configured`
		)
	}

	const otpEnabled = !!otpSecret
	const finalOtpSecret = otpSecret ? encrypt(otpSecret) : ''

	await setUserAccountOTPSecret(context.user!.userAccountId, finalOtpSecret, otpEnabled, context.dataContext)

	const cacheKey = `USER_${context.user!.userAccountId}`
	context.cacheContext.clearValue(cacheKey)
}
