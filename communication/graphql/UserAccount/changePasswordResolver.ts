import { IRequestContext } from '../../../foundation/context/prepareContext'
import { changePasswordWithToken } from '../../../activities/changePasswordWithToken'
import { changePasswordWithOldPassword } from '../../../activities/changePasswordWithOldPassword'

export async function changePasswordResolver(obj, args, context: IRequestContext) {
  const { emailAddress, token, newPassword, confirmPassword, oldPassword } = args.data
  try {
    if (token) {
      //reset password token flow
      await changePasswordWithToken(emailAddress, token, newPassword, context)
    } else {
      //manually change password flow
      await changePasswordWithOldPassword(oldPassword, newPassword, confirmPassword, context)
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
