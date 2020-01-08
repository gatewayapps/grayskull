import { DataContext } from './getDataContext'
import { CacheContext } from './getCacheContext'

import { getUserAccount } from '../services/user/getUserAccount'
import { verifyAndUseSession } from '../services/session/verifyAndUseSession'
import { UserAccount } from '../server/data/models/UserAccount'
import { getPrimaryEmailAddress } from '../services/emailAddress/getPrimaryEmailAddress'

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
  }
  const session = await verifyAndUseSession(sessionId, fingerprint, dataContext, cacheContext)
  if (!session) {
    return undefined
  }

  const userAccount = await getUserAccount(session.userAccountId, dataContext, cacheContext, false)
  if (userAccount) {
    const primaryEmailAddress = await getPrimaryEmailAddress(userAccount.userAccountId, dataContext, cacheContext)
    return {
      userAccount,
      primaryEmailAddress: primaryEmailAddress ? primaryEmailAddress.emailAddress : ''
    }
  }
}
