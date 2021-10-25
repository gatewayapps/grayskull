import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { decrypt } from '../operations/logic/encryption'
import { verifyOtpToken } from '../operations/logic/verifyOtpToken'

interface VerifyOtpData {
	token: string
	emailAddress?: string
	secret?: string | null
}

export async function verifyOtpTokenActivity(data: VerifyOtpData, context: IRequestContext): Promise<boolean> {
	const { emailAddress, token, secret } = data
	let otpSecretKey = secret

	if (!otpSecretKey) {
		if (!emailAddress) {
			throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `No emailAddress was provided`)
		}
		const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, undefined, true)
		if (!userAccount) {
			throw new GrayskullError(
				GrayskullErrorCode.InvalidEmailAddress,
				`No user account found associated with ${emailAddress}`
			)
		}

		if (context.configuration.Security.multifactorRequired && !userAccount.otpEnabled) {
			throw new GrayskullError(
				GrayskullErrorCode.MultifactorRequired,
				`Multifactor authentication is required, but not configured for user ${userAccount.userAccountId}`
			)
		}

		if (userAccount.otpEnabled && userAccount.otpSecret) {
			otpSecretKey = decrypt(userAccount.otpSecret)
			if (!otpSecretKey) {
				throw new GrayskullError(
					GrayskullErrorCode.InvalidOTP,
					`Unable to verify because OTP secret for user ${userAccount.userAccountId} was invalid`
				)
			}
		}
	}

	return verifyOtpToken(token, otpSecretKey)
}
