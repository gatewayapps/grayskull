import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { verifyPhoneNumberVerificationCode } from '../operations/data/phoneNumber/verifyPhoneNumberVerificationCode'
import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { addPrimaryPhoneNumber } from '../operations/data/phoneNumber/addPrimaryPhoneNumber'

export async function addPhoneNumberWithVerificationCodeActivity(
	phoneNumber: string,
	verificationCode: string,
	context: IRequestContext
) {
	ensureAuthenticated(context)
	const verified = await verifyPhoneNumberVerificationCode(phoneNumber, verificationCode, context.dataContext)
	if (!verified) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidPhoneVerificationCode,
			`Invalid verification code ${verificationCode} for ${phoneNumber}`
		)
	} else {
		await addPrimaryPhoneNumber(context.user!.userAccountId, phoneNumber, context.dataContext)
	}
}
