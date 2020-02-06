import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { IRequestContext } from '../foundation/context/prepareContext'
import { GrayskullErrorCode, GrayskullError } from '../foundation/errors/GrayskullError'
import { randomBytes } from 'crypto'
import { cacheValue } from '../operations/data/persistentCache/cacheValue'
import MailService from '../server/api/services/MailService'

/*
 *  1. Verify a user with the given email address exists
 *  2. Cache a token in the persistent cache for the reset password flow to use
 *  3. Send the email
 */

export async function sendResetPasswordEmail(emailAddress: string, context: IRequestContext) {
  const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext)
  if (!userAccount) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `Attempted to reset the password for ${emailAddress}, which does not exist`
    )
  } else {
    const token = randomBytes(32).toString('hex')
    const cacheKey = `RESET_PASSWORD:${emailAddress}`
    const cachedValue = `${userAccount.userAccountId}:${token}`
    const cacheTTL = 60 * 60 // 1 Hour

    await cacheValue(cacheKey, cachedValue, cacheTTL, context.dataContext)

    const resetPasswordLink = `${context.configuration.Server.baseUrl}/changePassword?emailAddress=${encodeURIComponent(
      emailAddress
    )}&token=${token}`
    await MailService.sendEmailTemplate(
      'resetPasswordTemplate',
      emailAddress,
      `${context.configuration.Server.realmName} Password Reset`,
      {
        resetLink: resetPasswordLink,
        realmName: context.configuration.Server.realmName,
        user: userAccount
      },
      context.configuration
    )
  }
}
