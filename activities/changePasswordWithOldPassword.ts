import { IRequestContext } from '../foundation/context/prepareContext'
import { verifyPassword } from '../operations/data/userAccount/verifyPassword'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { verifyPasswordStrength } from '../operations/logic/verifyPasswordStrength'
import { setUserAccountPassword } from '../operations/data/userAccount/setUserAccountPassword'
import { getUserAccount } from '../operations/data/userAccount/getUserAccount'

/*
 * 1.  Does the old password validate
 * 2.  Do the two new passwords match
 * 3.  Does the new password meet complexity requirements
 * 4.  Set the password
 */

export async function changePasswordWithOldPassword(
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  context: IRequestContext
) {
  if (!context.user) {
    throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `You must be signed in to change your password`)
  } else {
    const oldPasswordVerified = await verifyPassword(context.user.userAccountId, oldPassword, context.dataContext)
    if (!oldPasswordVerified) {
      throw new GrayskullError(GrayskullErrorCode.IncorrectPassword, `The old password provided is not correct`)
    } else {
      if (newPassword !== confirmPassword) {
        throw new GrayskullError(GrayskullErrorCode.IncorrectPassword, `new password does not match confirm password`)
      } else {
        const verificationResult = verifyPasswordStrength(newPassword, context.configuration.Security)
        if (!verificationResult.success) {
          throw new GrayskullError(
            GrayskullErrorCode.PasswordFailsSecurityRequirements,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            verificationResult.validationErrors!.join(';')
          )
        } else {
          const userAccount = await getUserAccount(
            context.user.userAccountId,
            context.dataContext,
            context.cacheContext,
            true
          )
          if (!userAccount) {
            throw new GrayskullError(GrayskullErrorCode.InvalidUserAccountId, `Something is broken`)
          }

          await setUserAccountPassword(
            userAccount.userAccountId,
            newPassword,
            context.dataContext,
            context.cacheContext
          )
          return true
        }
      }
    }
  }
}
