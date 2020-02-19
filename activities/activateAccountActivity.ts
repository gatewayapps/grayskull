import { IRequestContext } from '../foundation/context/prepareContext'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getValue } from '../operations/data/persistentCache/getValue'
import { verifyPasswordStrength } from '../operations/logic/verifyPasswordStrength'
import { setUserAccountPassword } from '../operations/data/userAccount/setUserAccountPassword'
import { clearValue } from '../operations/data/persistentCache/clearValue'
import { getCacheKeyForUserAccountActivation } from '../operations/logic/getCacheKeyForUserAccountActivation'
import { setUserAccountActive } from '../operations/data/userAccount/setUserAccountActive'

export async function activateAccountActivity(
  emailAddress: string,
  password: string,
  activationToken: string,
  context: IRequestContext
) {
  const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext, true)
  if (!userAccount) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `Attempted to activate user with email address ${emailAddress}, which does not exist`
    )
  }
  const CACHE_KEY = getCacheKeyForUserAccountActivation(emailAddress)

  const accountActivationRecord = await getValue(CACHE_KEY, context.dataContext)
  if (!accountActivationRecord) {
    throw new GrayskullError(
      GrayskullErrorCode.ExpiredResetPasswordToken,
      'The provided token is no longer valid for activating the user.'
    )
  }
  if (accountActivationRecord !== activationToken) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidResetPasswordToken,
      `Attempted to activate an account with invalid token - ${activationToken}`
    )
  }
  const verificationResult = verifyPasswordStrength(password, context.configuration.Security)
  if (!verificationResult.success) {
    throw new GrayskullError(
      GrayskullErrorCode.PasswordFailsSecurityRequirements,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      verificationResult.validationErrors!.join(';')
    )
  }
  await setUserAccountActive(userAccount.userAccountId, true, context.dataContext)
  await setUserAccountPassword(userAccount.userAccountId, password, context.dataContext, context.cacheContext)
  await clearValue(CACHE_KEY, context.dataContext)

  return true
}
