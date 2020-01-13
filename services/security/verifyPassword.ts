import { DataContext } from '../../context/getDataContext'
import { getUserAccount } from '../user/getUserAccount'
import { CacheContext } from '../../context/getCacheContext'
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
