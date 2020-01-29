import { hash } from 'bcrypt'
import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext } from '../../../foundation/context/getCacheContext'

import { UserAccount } from '../../../foundation/models/UserAccount'

export async function setUserAccountPassword(
  userAccount: UserAccount,
  newPassword: string,
  dataContext: DataContext,
  cacheContext: CacheContext
) {
  userAccount.passwordHash = await hash(newPassword, 10)
  await userAccount.save()
  const cacheKey = `USER_${userAccount.userAccountId}`
  cacheContext.clearValue(cacheKey)
}
