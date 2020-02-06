import { IRequestContext } from '../../../foundation/context/prepareContext'
import { authenticateUser } from '../../../activities/authenticateUser'
import { setAuthCookies } from '../../../operations/logic/authentication'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function loginResolver(obj, args, context: IRequestContext) {
  const { emailAddress, password, otpToken, extendedSession } = args.data

  try {
    const session = await authenticateUser(emailAddress, password, context, otpToken, extendedSession)
    setAuthCookies(context.res, session)
    return {
      success: true
    }
  } catch (err) {
    if (err instanceof GrayskullError) {
      switch (err.code) {
        case GrayskullErrorCode.InvalidOTP:
        case GrayskullErrorCode.RequiresOTP: {
          return {
            success: false,
            otpRequired: true,
            message: otpToken ? err.message : ''
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
