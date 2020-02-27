import { IRequestContext } from '../../../foundation/context/prepareContext'
import { addPhoneNumberWithVerificationCodeActivity } from '../../../activities/addPhoneNumberWithVerificationCodeActivity'

export async function addPhoneNumberWithVerificationCodeResolver(obj, args, context: IRequestContext) {
	try {
		await addPhoneNumberWithVerificationCodeActivity(args.phoneNumber, args.verificationCode, context)
		return {
			success: true
		}
	} catch (err) {
		return {
			success: false,
			message: err.message
		}
	}
}
