import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext } from '../../../foundation/context/getCacheContext'
import { UserAccount } from '../../../foundation/models/UserAccount'

export async function getUserAccount(
  userAccountId: string,
  dataContext: DataContext,
  cacheContext: CacheContext,
  includeSensitive = false
) {
  const cacheKey = `USER_${userAccountId}`
  const cachedUser = cacheContext.getValue<UserAccount>(cacheKey)
  if (cachedUser && !includeSensitive) {
    delete cachedUser.otpSecret
    delete cachedUser.passwordHash

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
