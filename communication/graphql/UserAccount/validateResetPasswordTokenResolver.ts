import { IRequestContext } from '../../../foundation/context/prepareContext'
import { IOperationResponse } from '../../../foundation/types/types'
import { validateResetPasswordTokenActivity } from '../../../activities/validateResetPasswordTokenActivity'

export async function validateResetPasswordTokenResolver(
	obj,
	args,
	context: IRequestContext
): Promise<IOperationResponse> {
	const token = args.data.token
	const emailAddress = decodeURIComponent(args.data.emailAddress)
	const isValid = await validateResetPasswordTokenActivity(emailAddress, token, context)
	if (isValid) {
		return {
			success: true
		}
	} else {
		return {
			success: false,
			message: 'Invalid email address or token'
		}
	}
}
