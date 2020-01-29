import { DataContext } from '../../../foundation/context/getDataContext'
import { getUserAccount } from './getUserAccount'
import { CacheContext } from '../../../foundation/context/getCacheContext'
import { compare } from 'bcrypt'

export async function verifyPassword(
  userAccountId: string,
  password: string,
  dataContext: DataContext,
  cacheContext: CacheContext
): Promise<boolean> {
  const userAccount = await getUserAccount(userAccountId, dataContext, cacheContext, true)
  return await compare(password, userAccount.passwordHash)
}
