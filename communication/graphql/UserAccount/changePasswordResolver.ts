import { IRequestContext } from '../../../foundation/context/prepareContext'
import { changePasswordWithTokenActivity } from '../../../activities/changePasswordWithTokenActivity'
import { changePasswordWithOldPasswordActivity } from '../../../activities/changePasswordWithOldPasswordActivity'

export async function changePasswordResolver(obj, args, context: IRequestContext) {
  const { emailAddress, token, newPassword, confirmPassword, oldPassword } = args.data
  try {
    if (token) {
      //reset password token flow
      await changePasswordWithTokenActivity(emailAddress, token, newPassword, context)
    } else {
      //manually change password flow
      await changePasswordWithOldPasswordActivity(oldPassword, newPassword, confirmPassword, context)
    }
    return {
      success: true
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: err.message,
      message: err.message
    }
  }
}
