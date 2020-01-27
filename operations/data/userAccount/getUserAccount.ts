import { DataContext } from '../../../context/getDataContext'
import { CacheContext } from '../../../context/getCacheContext'
import { UserAccount } from '../../../server/data/models/UserAccount'

export async function getUserAccount(
  userAccountId: string,
  dataContext: DataContext,
  cacheContext: CacheContext,
  includeSensitive = false
) {
  const cacheKey = `USER_${userAccountId}`
  const cachedUser = cacheContext.getValue<UserAccount>(cacheKey)
  if (cachedUser) {
    if (!includeSensitive) {
      delete cachedUser.otpSecret
      delete cachedUser.passwordHash
      delete cachedUser.resetPasswordToken
      delete cachedUser.resetPasswordTokenExpiresAt
    }
    return cachedUser
  }

  const user = await dataContext.UserAccount.findOne({
    where: {
      userAccountId
    },
    attributes: {
      exclude: includeSensitive
        ? []
        : ['passwordHash', 'otpSecret', 'resetPasswordToken', 'resetPasswordTokenExpiresAt']
    }
  })

  if (user) {
    cacheContext.setValue(cacheKey, user, 30)
  } else {
    throw new Error(`User with userAccountId=${userAccountId} does not exist`)
  }

  return user
}
