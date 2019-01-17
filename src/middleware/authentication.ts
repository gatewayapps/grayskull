import { Request, Response, NextFunction } from 'express'
import { setAuthCookies, getAuthCookies, clearAuthCookies } from '../utils/authentication'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import UserAccountService from '@services/UserAccountService'
import SessionService from '@services/SessionService'

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

  const session = await SessionService.verifyAndUseSession(sessionId, fingerprint, req.ip)
  if (!session) {
    SessionService.deleteSession({ sessionId })
    clearAuthCookies(res)
    return next()
  }

  const user = await UserAccountService.getUserAccount({ userAccountId: session.userAccountId })
  if (!user) {
    clearAuthCookies(res)
    return next()
  }

  setAuthCookies(res, session)

  req.user = user
  req.session = session

  return next()
}
