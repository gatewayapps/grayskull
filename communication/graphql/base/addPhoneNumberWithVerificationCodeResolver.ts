import { IRequestContext } from '../../../foundation/context/prepareContext'
import { addPhoneNumberWithVerificationCodeActivity } from '../../../activities/addPhoneNumberWithVerificationCodeActivity'

export async function addPhoneNumberWithVerificationCodeResolver(obj, args, context: IRequestContext) {
	try {
		await addPhoneNumberWithVerificationCodeActivity(args.phoneNumber, args.verificationCode, context)
		return {
			success: true
		}
	} catch (err) {
		if (err instanceof Error) {
			return { success: false, message: err.message }
		} else {
			return {
				success: false,
				message: 'Unknown error'
			}
		}
	}
}
