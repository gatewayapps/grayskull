import { Request, Response } from 'express'
import ConfigurationManager from '@/config/ConfigurationManager'

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

  hostname = hostname || `localhost:${ConfigurationManager.General.port}`

  const query = [
    `client_id=${ConfigurationManager.General.grayskullClientId}`,
    `response_type=code`,
    `redirect_uri=${encodeURIComponent(`${protocol}://${hostname}/users/signin`)}`,
    `state=${state}`
  ]
  return `${ConfigurationManager.General.fallbackUrl}/auth?${query.join('&')}`
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

export function setAuthCookies(res: Response, sessionId: string, accessToken: string, expiresIn: number) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, { httpOnly: true, maxAge: expiresIn, signed: true })
  res.cookie(SESSION_ID_COOKIE_NAME, sessionId, { httpOnly: true, signed: true })
}

export function getAuthCookies(req: Request) {
  const accessToken = req.signedCookies[ACCESS_TOKEN_COOKIE_NAME]
  const sessionId = req.signedCookies[SESSION_ID_COOKIE_NAME]
  return {
    accessToken,
    sessionId
  }
}