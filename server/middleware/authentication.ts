
import { clearAuthCookies, getAuthCookies, setAuthCookies, RequestContext, ResponseContext } from '../utils/authentication'
import { ISession } from '../data/models/ISession'
import { IUserAccount } from '../data/models/IUserAccount'
import SessionService from '../api/services/SessionService'
import UserAccountService from '../api/services/UserAccountService'
import UserAccountRepository from '../data/repositories/UserAccountRepository'
import SessionRepository from '../data/repositories/SessionRepository'

import EmailAddressRepository from '../data/repositories/EmailAddressRepository'


let FIRST_USER_CREATED = false
const MIN_TIME_TO_UPDATE_LAST_ACTIVE = 60 * 1000 // 1 minute

export interface IRefreshAccessTokenResult {
  access_token: string
  expires_in: number
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserAccount
      session?: ISession
    }
  }
}

/** Sets req.user and req.session to authenticated user and session */
export async function getUserContext(req: RequestContext, res: ResponseContext) {
  if (/^\/(static|_next)/i.test(req.url!)) {
    return
  }

  const { sessionId } = getAuthCookies(req)
  if (!sessionId) {
    return
  }

  const fingerprint = req.headers['x-fingerprint']?.toString()
  if (!fingerprint) {
    return
  }

  const session = await SessionService.verifyAndUseSession(sessionId, fingerprint, req.socket.remoteAddress!, { userContext: null })
  if (!session) {
    SessionRepository.deleteSession({ sessionId }, { userContext: null })
    clearAuthCookies(res)
    return
  }

  const user = await UserAccountRepository.getUserAccount({ userAccountId: session.userAccountId }, { userContext: null })

  if (!user) {
    clearAuthCookies(res)
    return
  }

  if (!user.lastActive || Date.now() - user.lastActive.getTime() > MIN_TIME_TO_UPDATE_LAST_ACTIVE) {
    await UserAccountService.updateUserActive(session.userAccountId, { userContext: user })
  }

  const primaryEmail = await EmailAddressRepository.getEmailAddresses({ userAccountId_equals: session.userAccountId, primary_equals: true }, { userContext: null })

  setAuthCookies(res, session)

  const finalUser = Object.assign(user, { emailAddress: primaryEmail[0].emailAddress })

  return {
    user: finalUser,
    session
  }
}
