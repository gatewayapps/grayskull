import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getEmailAddressByEmailAddress } from '../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { decrypt } from '../operations/logic/encryption'

export async function getOtpSecretActivity(args, context: IRequestContext) {
	const { emailAddress } = args.data
	const emailRecord = await getEmailAddressByEmailAddress(emailAddress, context.dataContext)
	if (!emailRecord) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailAddress,
			`Attempted to sign in with email address ${emailAddress} which is not registered`
		)
	}
	if (!emailRecord.verified) {
		throw new GrayskullError(
			GrayskullErrorCode.EmailNotVerified,
			`Attempted to sign in with email address ${emailAddress} which is not verified`
		)
	}
	if (!emailRecord.primary) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailAddress,
			`Attempted to sign in with email address ${emailAddress} which is not a primary address`
		)
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
		return decrypt(userAccount.otpSecret)
	}
}
