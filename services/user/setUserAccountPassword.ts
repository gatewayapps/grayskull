import { hash } from 'bcrypt'
import { DataContext } from '../../context/getDataContext'
import { CacheContext } from '../../context/getCacheContext'
import { getUserAccount } from './getUserAccount'

export async function setUserAccountPassword(
  userAccountId: string,
  newPassword: string,
  dataContext: DataContext,
  cacheContext: CacheContext
) {
  const userAccount = await getUserAccount(userAccountId, dataContext, cacheContext, true)

  userAccount.passwordHash = await hash(newPassword, 10)
  await userAccount.save()
  const cacheKey = `USER_${userAccountId}`
  cacheContext.clearValue(cacheKey)
}
