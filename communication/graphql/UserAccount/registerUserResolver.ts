import { IRequestContext } from '../../../foundation/context/prepareContext'
import { IRegisterUserResponse } from '../../../foundation/types/types'
import { registerUserActivity } from '../../../activities/authentication/registerUserActivity'
import { GrayskullError } from '../../../foundation/errors/GrayskullError'

export async function registerUserResolver(obj, args, context: IRequestContext): Promise<IRegisterUserResponse> {
	try {
		// eslint-disable-next-line @typescript-eslint/camelcase
		// eslint-disable-next-line no-unused-vars
		const { client_id, confirm, emailAddress, password, ...userInfo } = args.data
		const { shouldAutoVerify } = await registerUserActivity(userInfo, emailAddress, password, context)
		return {
			success: true,
			autoVerified: shouldAutoVerify,
			message: shouldAutoVerify
				? 'Your account has been created and verified!'
				: `Your account has been created and a verification e-mail has been sent to ${emailAddress}.  You must click the link in the message before you can sign in.`
		}
	} catch (err) {
		if (err instanceof GrayskullError) {
			return { success: false, error: err.code, message: err.message }
		} else if (err instanceof Error) {
			return { success: false, message: err.message }
		} else {
			return {
				success: false,
				message: 'Unknown error'
			}
		}
	}
}
