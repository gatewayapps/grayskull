import { Request, Response, NextFunction } from 'express'
import { setAuthCookies, getAuthCookies, clearAuthCookies } from '../utils/authentication'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import UserAccountService from '@services/UserAccountService'
import SessionService from '@services/SessionService'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
import SessionRepository from '@data/repositories/SessionRepository'

let FIRST_USER_CREATED = false

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

/** Determines if ant user exists in the database and sets NEEDS_FIRST_USER header if not */
export async function firstUserMiddleware(req: Request, res: Response, next: any) {
  if (!FIRST_USER_CREATED) {
    const userMeta = await UserAccountRepository.userAccountsMeta(null, { userContext: null })
    FIRST_USER_CREATED = userMeta.count > 0
  }
  res.locals['NEEDS_FIRST_USER'] = !FIRST_USER_CREATED

  next()
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

  setAuthCookies(res, session)

  req.user = user
  req.session = session
  res.locals.userContext = user

  return next()
}
