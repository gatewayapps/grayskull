import ConfigurationManager from '@/config/ConfigurationManager'
import { Request, Response, NextFunction } from 'express'
import fetch from 'isomorphic-fetch'
import jwt from 'jsonwebtoken'
import { generateLoginUrl, setAuthCookies, getAuthCookies } from '../utils/authentication'
import { UserAccountInstance } from '@data/models/UserAccount'
import { IUserAccount } from '@data/models/IUserAccount'
import UserAccountService from '@services/UserAccountService';
import SessionService from '@services/SessionService';
import AuthenticationService from '@services/AuthenticationService';

const ACCESS_TOKEN_EXPIRATION_WINDOW = 5 * 60

export interface IRefreshAccessTokenResult {
  access_token: string
  expires_in: number
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserAccount
    }
  }
}

export async function getUserContext(req: Request, res: Response, next: NextFunction) {
  if (/^\/(static|_next)/i.test(req.path)) {
    next()
    return
  }

  const { accessToken, sessionId } = getAuthCookies(req)

  if (!sessionId || !accessToken) {
    next()
    return
  }

  let accessTokenExpiresIn = 0
  let decodedToken: any
  let userAccount: UserAccountInstance | null = null

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, ConfigurationManager.Security.globalSecret)
      if (typeof decoded === 'object') {
        decodedToken = decoded
        if (typeof decodedToken.exp === 'number') {
          accessTokenExpiresIn = decodedToken.exp - Date.now() / 1000
        }
      }
    } catch (err) {
      // Any error other than Token Expired then return not authorized
      if (err.name !== 'TokenExpiredError') {
        console.error('Token failed to verify', accessToken)
        console.error(err)
        next()
        return
      }
    }
  }

  if (!decodedToken || accessTokenExpiresIn <= ACCESS_TOKEN_EXPIRATION_WINDOW) {
    const refreshAccessTokenResult = await refreshAccessToken(sessionId)
    if (refreshAccessTokenResult) {
      setAuthCookies(res, sessionId, refreshAccessTokenResult.access_token, refreshAccessTokenResult.expires_in)
      decodedToken = jwt.decode(refreshAccessTokenResult.access_token)
    }
  }

  if (decodedToken) {
    userAccount = await UserAccountService.getUserAccount({ userAccountId: decodedToken.userAccountId })
  }

  if (!userAccount) {
    next()
    return
  }

  req.user = userAccount

  next()
  return
}

async function refreshAccessToken(sessionId): Promise<IRefreshAccessTokenResult | null> {
  try {
    const session = await SessionService.getSession({ sessionId: sessionId })
    if (!session) {
      return null
    }

    const atResult = await AuthenticationService.getAccessToken(
      'refresh_token',
      ConfigurationManager.General.grayskullClientId,
      ConfigurationManager.Security.globalSecret,
      undefined,
      session.refreshToken)

    if (!atResult.access_token || !atResult.refresh_token) {
      return null
    }

    // Update the lastUsedOn time for the session with the current time
    session.lastUsedAt = new Date()
    await SessionService.updateSession({ sessionId: session.sessionId }, session)

    return {
      access_token: atResult.access_token,
      expires_in: atResult.expires_in
    }
  } catch (err) {
    console.error(err)
    return null
  }
}
