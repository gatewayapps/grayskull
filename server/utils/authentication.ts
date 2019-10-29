import { Request, Response } from 'express'
import ConfigurationManager from '@/config/ConfigurationManager'
import { ISession } from '@data/models/ISession'

export const ACCESS_TOKEN_COOKIE_NAME = 'at'
export const SESSION_ID_COOKIE_NAME = 'sid'

export interface IGenerateLoginUrlOptions {
  returnUrl?: string
  state?: string
}

export interface IAuthState {
  returnPath: string
}

export function generateLoginUrl(protocol: string, hostname: string | undefined, options: IGenerateLoginUrlOptions = {}) {
  let { state } = options

  if (!state) {
    state = generateState(options.returnUrl || '/')
  }

  const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
  const HTTP_PORT = IS_DEVELOPMENT ? 3000 : 80

  const query = [`client_id=grayskull`, `response_type=code`, `redirect_uri=${encodeURIComponent(`${ConfigurationManager.Server!.baseUrl}/signin`)}`, `state=${state}`]
  return `/authorize?${query.join('&')}`
}

export function generateState(returnPath: string): string {
  const stateObj: IAuthState = {
    returnPath
  }
  const state = Buffer.from(JSON.stringify(stateObj), 'utf8').toString('base64')
  return state
}

export function decodeState(state: string | undefined): IAuthState | null {
  if (!state) {
    return null
  }
  try {
    const stateObj = JSON.parse(Buffer.from(state, 'base64').toString('ascii'))
    return stateObj as IAuthState
  } catch (e) {
    return null
  }
}

export function setAuthCookies(res: Response, session: ISession) {
  res.cookie(SESSION_ID_COOKIE_NAME, session.sessionId!, { httpOnly: true, signed: true, expires: session.expiresAt })
}

export function getAuthCookies(req: Request) {
  const sessionId = req.signedCookies[SESSION_ID_COOKIE_NAME]
  return {
    sessionId
  }
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(SESSION_ID_COOKIE_NAME)
}
