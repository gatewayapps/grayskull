import { IRequestContext } from '../../../foundation/context/prepareContext'
import { sendResetPasswordEmail } from '../../../activities/sendResetPasswordEmail'

export async function resetPasswordResolver(obj, args, context: IRequestContext) {
  // insert your resetPassword implementation here
  try {
    await sendResetPasswordEmail(args.data.emailAddress, context)
  } catch (err) {
    console.error(err)
  } finally {
    // We return true no matter what to prevent fishing for email addresses
    return true
  }
}
