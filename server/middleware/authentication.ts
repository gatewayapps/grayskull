import { NextFunction, Request, Response } from 'express'
import { clearAuthCookies, getAuthCookies, setAuthCookies } from '../utils/authentication'
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
export async function getUserContext(req: Request, res: Response, next: NextFunction) {
  if (/^\/(static|_next)/i.test(req.path)) {
    return next()
  }

  const { sessionId } = getAuthCookies(req)
  if (!sessionId) {
    return next()
  }

  const fingerprint = req.header('x-fingerprint')
  if (!fingerprint) {
    return next()
  }

  const session = await SessionService.verifyAndUseSession(sessionId, fingerprint, req.ip, { userContext: null })
  if (!session) {
    SessionRepository.deleteSession({ sessionId }, { userContext: null })
    clearAuthCookies(res)
    return next()
  }

  const user = await UserAccountRepository.getUserAccount({ userAccountId: session.userAccountId }, { userContext: null })

  if (!user) {
    clearAuthCookies(res)
    return next()
  }

  if (!user.lastActive || Date.now() - user.lastActive.getTime() > MIN_TIME_TO_UPDATE_LAST_ACTIVE) {
    await UserAccountService.updateUserActive(session.userAccountId, { userContext: user })
  }

  const primaryEmail = await EmailAddressRepository.getEmailAddresses({ userAccountId_equals: session.userAccountId, primary_equals: true }, { userContext: null })

  setAuthCookies(res, session)

  const finalUser = Object.assign(user, { emailAddress: primaryEmail[0].emailAddress })

  req.user = finalUser
  req.session = session
  res.locals.userContext = finalUser

  return next()
}
