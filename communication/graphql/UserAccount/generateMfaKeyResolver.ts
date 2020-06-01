import { IRequestContext } from '../../../foundation/context/prepareContext'
import { generateOtpSecretActivity } from '../../../activities/generateOTPSecretActivity'

export async function generateMfaKeyResolver(obj, args, context: IRequestContext) {
	return generateOtpSecretActivity(args.data.emailAddress, context)
}
