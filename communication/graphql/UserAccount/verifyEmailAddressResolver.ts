import { IRequestContext } from '../../../foundation/context/prepareContext'
import { IOperationResponse } from '../../../foundation/types/types'
import { verifyEmailAddressActivity } from '../../../activities/verifyEmailAddressActivity'

export async function verifyEmailAddressResolver(obj, args, context: IRequestContext): Promise<IOperationResponse> {
	try {
		await verifyEmailAddressActivity(decodeURIComponent(args.data.emailAddress), args.data.code, context)

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
