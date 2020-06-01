import { IOperationResponse } from '../../../foundation/types/types'
import { IRequestContext } from '../../../foundation/context/prepareContext'
import { activateAccountActivity } from '../../../activities/activateAccountActivity'

export async function activateAccountResolver(obj, args, context: IRequestContext): Promise<IOperationResponse> {
	const { emailAddress, token, password, confirmPassword } = args.data

	if (password !== confirmPassword) {
		return {
			success: false,
			message: 'Password does not match confirm password'
		}
	}

	await activateAccountActivity(emailAddress, password, token, context)
	return { success: true }
}
