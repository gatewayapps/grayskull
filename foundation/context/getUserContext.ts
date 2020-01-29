import { DataContext } from './getDataContext'
import { CacheContext } from './getCacheContext'

import { getUserAccount } from '../../operations/data/userAccount/getUserAccount'
import { verifyAndUseSession } from '../../operations/data/session/verifyAndUseSession'
import { UserAccount } from '../models/UserAccount'
import { getPrimaryEmailAddress } from '../../operations/data/emailAddress/getPrimaryEmailAddress'

export interface UserContext {
  userAccount: UserAccount
  primaryEmailAddress: string
}

export async function getUserContext(
  sessionId: string,
  fingerprint: string,
  dataContext: DataContext,
  cacheContext: CacheContext
): Promise<UserContext | undefined> {
  if (!sessionId) {
    return undefined
  } else {
    const session = await verifyAndUseSession(sessionId, fingerprint, dataContext, cacheContext)
    if (!session) {
      return undefined
    } else {
      const userAccount = await getUserAccount(session.userAccountId, dataContext, cacheContext, false)

      const primaryEmailAddress = await getPrimaryEmailAddress(userAccount.userAccountId, dataContext, cacheContext)
      return {
        userAccount,
        primaryEmailAddress: primaryEmailAddress ? primaryEmailAddress.emailAddress : ''
      }
    }
  }
}
