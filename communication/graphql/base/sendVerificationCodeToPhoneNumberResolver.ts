import { IRequestContext } from '../../../foundation/context/prepareContext'
import { sendVerificationCodeToPhoneNumberActivity } from '../../../activities/sendVerificationCodeToPhoneNumberActivity'

export async function sendVerificationCodeToPhoneNumberResolver(obj, args, context: IRequestContext) {
	await sendVerificationCodeToPhoneNumberActivity(args.phoneNumber, context)
	return {
		success: true
	}
}
