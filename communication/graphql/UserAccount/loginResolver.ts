import { IRequestContext } from '../../../foundation/context/prepareContext'
import { authenticateUserActivity } from '../../../activities/authenticateUserActivity'
import { setAuthCookies } from '../../../operations/logic/authentication'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import { getOTPBackupOptionsForEmailAddressActivity } from '../../../activities/getOTPBackupOptionsForEmailAddressActivity'

export async function loginResolver(obj, args, context: IRequestContext) {
	const { emailAddress, password, otpToken, extendedSession } = args.data

	try {
		const session = await authenticateUserActivity(emailAddress, password, context, otpToken, extendedSession)
		setAuthCookies(context.res, session)
		return {
			success: true
		}
	} catch (err) {
		if (err instanceof GrayskullError) {
			switch (err.code) {
				case GrayskullErrorCode.InvalidOTP:
				case GrayskullErrorCode.RequiresOTP: {
					const otpOptions = await getOTPBackupOptionsForEmailAddressActivity(emailAddress, context)

					return {
						success: false,
						otpRequired: true,
						message: otpToken ? err.message : '',
						otpOptions
					}
				}
				case GrayskullErrorCode.EmailNotVerified: {
					return {
						success: false,
						emailVerificationRequired: true,
						message: err.message
					}
				}
				default: {
					return {
						success: false,
						message: err.message
					}
				}
			}
		} else {
			return {
				success: false,
				message: err.message
			}
		}
	}
}
