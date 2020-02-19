import { IRequestContext } from '../foundation/context/prepareContext'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'

import { getValue } from '../operations/data/persistentCache/getValue'

export async function validateResetPasswordTokenActivity(
  emailAddress: string,
  token: string,
  context: IRequestContext
) {
  const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext, true)
  if (!userAccount) {
    return false
  } else {
    const cacheKey = `RESET_PASSWORD:${emailAddress}`

    const resetPasswordRecord = await getValue(cacheKey, context.dataContext)
    if (!resetPasswordRecord) {
      return false
    } else {
      const expectedCacheValue = `${userAccount.userAccountId}:${token}`
      if (resetPasswordRecord !== expectedCacheValue) {
        return false
      } else {
        return true
      }
    }
  }
}
