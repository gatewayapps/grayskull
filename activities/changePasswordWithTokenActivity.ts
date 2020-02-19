import { IRequestContext } from '../foundation/context/prepareContext'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getValue } from '../operations/data/persistentCache/getValue'
import { verifyPasswordStrength } from '../operations/logic/verifyPasswordStrength'
import { setUserAccountPassword } from '../operations/data/userAccount/setUserAccountPassword'
import { clearValue } from '../operations/data/persistentCache/clearValue'

/*
 *  Changing a password with a token should involve the following steps:
 *  1. Verify a user account exists for the given email address
 *  2. Verifying the token is valid for the email address provided
 *  3. Verifying the new password meets the complexity requirements of the realm
 *  4. Calling setUserAccountPassword with the users account id and new password
 *  5. Remove the token from persistent cache
 */

export async function changePasswordWithTokenActivity(
  emailAddress: string,
  token: string,
  newPassword: string,
  context: IRequestContext
) {
  const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext, true)
  if (!userAccount) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `Attempted to change the password for email address ${emailAddress}, which does not exist`
    )
  } else {
    const cacheKey = `RESET_PASSWORD:${emailAddress}`

    const resetPasswordRecord = await getValue(cacheKey, context.dataContext)
    if (!resetPasswordRecord) {
      throw new GrayskullError(
        GrayskullErrorCode.ExpiredResetPasswordToken,
        'The provided token is no longer valid for changing the password.'
      )
    } else {
      const expectedCacheValue = `${userAccount.userAccountId}:${token}`
      if (resetPasswordRecord !== expectedCacheValue) {
        throw new GrayskullError(
          GrayskullErrorCode.InvalidResetPasswordToken,
          `Attempted to change a password with invalid token - ${expectedCacheValue}`
        )
      } else {
        const verificationResult = verifyPasswordStrength(newPassword, context.configuration.Security)
        if (!verificationResult.success) {
          throw new GrayskullError(
            GrayskullErrorCode.PasswordFailsSecurityRequirements,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            verificationResult.validationErrors!.join(';')
          )
        } else {
          await setUserAccountPassword(
            userAccount.userAccountId,
            newPassword,
            context.dataContext,
            context.cacheContext
          )

          await clearValue(cacheKey, context.dataContext)

          return true
        }
      }
    }
  }
}
