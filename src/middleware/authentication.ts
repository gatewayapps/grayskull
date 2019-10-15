import { Request, Response, NextFunction } from 'express'
import { setAuthCookies, getAuthCookies, clearAuthCookies } from '../utils/authentication'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'

import SessionService from '@services/SessionService'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
import SessionRepository from '@data/repositories/SessionRepository'
import ConfigurationManager from '@/config/ConfigurationManager'
import EmailAddressRepository from '@data/repositories/EmailAddressRepository'

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
  res.locals.configuration = {
    securityConfiguration: {
      multifactorRequired: ConfigurationManager.Security!.multifactorRequired,
      passwordRequiresLowercase: ConfigurationManager.Security!.passwordRequiresLowercase,
      passwordRequiresUppercase: ConfigurationManager.Security!.passwordRequiresUppercase,
      passwordRequiresNumber: ConfigurationManager.Security!.passwordRequiresNumber,
      passwordRequiresSymbol: ConfigurationManager.Security!.passwordRequiresSymbol,
      passwordMinimumLength: ConfigurationManager.Security!.passwordMinimumLength,
      allowSignup: ConfigurationManager.Security!.allowSignup
    },

    serverConfiguration: {
      realmName: ConfigurationManager.Server!.realmName,
      realmLogo: ConfigurationManager.Server!.realmLogo || '/static/grayskull.svg',
      baseUrl: ConfigurationManager.Server!.baseUrl
    }
  }
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
  //await UserAccountService.updateUserActive(session.userAccountId, { userContext: user })

  const primaryEmail = await EmailAddressRepository.getEmailAddresses({ userAccountId_equals: session.userAccountId, primary_equals: true }, { userContext: null })

  setAuthCookies(res, session)

  const finalUser = Object.assign(user, { emailAddress: primaryEmail[0].emailAddress })

  req.user = finalUser
  req.session = session
  res.locals.userContext = finalUser

  return next()
}
