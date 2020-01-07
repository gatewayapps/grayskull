import { DataContext } from '../../context/getDataContext'
import { CacheContext } from '../../context/getCacheContext'
import { UserAccount } from '../../server/data/models/UserAccount'

export async function getUserAccount(
  userAccountId: number,
  dataContext: DataContext,
  cacheContext: CacheContext,
  includeSensitive = false
) {
  const cacheKey = `USER_${userAccountId}`
  const cachedUser = cacheContext.getValue<UserAccount>(cacheKey)
  if (cachedUser) {
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
  }

  return user
}
