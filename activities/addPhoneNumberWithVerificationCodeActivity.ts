import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { verifyPhoneNumberVerificationCode } from '../operations/data/phoneNumber/verifyPhoneNumberVerificationCode'
import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { addPrimaryPhoneNumber } from '../operations/data/phoneNumber/addPrimaryPhoneNumber'
import { getCacheKeyForPhoneNumberVerification } from '../operations/logic/getCacheKeyForPhoneNumberVerification'
import { clearValue } from '../operations/data/persistentCache/clearValue'

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
		const CACHE_KEY = getCacheKeyForPhoneNumberVerification(phoneNumber)
		await clearValue(CACHE_KEY, context.dataContext)

		await addPrimaryPhoneNumber(context.user!.userAccountId, phoneNumber, context.dataContext)
		context.cacheContext.clearValue(`USER_${context.user!.userAccountId}`)
	}
}
