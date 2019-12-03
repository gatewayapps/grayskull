import { ISession } from '../data/models/ISession'
import originalUrl from 'original-url'
import { ServerResponse, IncomingMessage } from 'http'
import Cookies from 'cookies'
import SessionService from '../api/services/SessionService'
import { IUserAccount } from '../data/models/IUserAccount'
import { getUserContext } from '../middleware/authentication'
import ClientRepository from '../data/repositories/ClientRepository'

export type RequestContext = IncomingMessage & {
  cookies: Cookies
  parsedUrl: URL
  originalUrl: string
  session?: ISession
  user?: IUserAccount & {
    emailAddress: string
  }
}
export type ResponseContext = ServerResponse & {
  cookies: Cookies
  session?: ISession
  user?: IUserAccount & {
    emailAddress: string
  }
  locals?: any
}

export const ACCESS_TOKEN_COOKIE_NAME = 'at'
export const SESSION_ID_COOKIE_NAME = 'sid'

export interface IAuthState {
  returnPath: string
}

// export async function generateLoginUrl(protocol: string, hostname: string | undefined, options: IGenerateLoginUrlOptions = {}) {

//   const config = await getCurrentConfiguration()

//   let { state } = options

//   if (!state) {
//     state = generateState(options.returnUrl || '/')
//   }

//   const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production'
//   const HTTP_PORT = IS_DEVELOPMENT ? 3000 : 80

//   const query = [`client_id=grayskull`, `response_type=code`, `redirect_uri=${encodeURIComponent(`${ConfigurationManager.Server!.baseUrl}/signin`)}`, `state=${state}`]
//   return `/authorize?${query.join('&')}`
// }

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

export function setAuthCookies(res: ResponseContext, session: ISession) {
  res.cookies.set(SESSION_ID_COOKIE_NAME, session.sessionId!, { httpOnly: true, expires: session.expiresAt })
}

export function getAuthCookies(req: RequestContext) {
  const sessionId = req.cookies.get(SESSION_ID_COOKIE_NAME)
  return {
    sessionId
  }
}

export async function doLogout(req: RequestContext, res: ResponseContext) {
  const cookies = new Cookies(req, res)
  req.cookies = cookies
  res.cookies = cookies

  const { sessionId } = getAuthCookies(req)
  if (sessionId) {
    await SessionService.deleteSession({ sessionId }, { userContext: req.user || null })
  }
  clearAuthCookies(res)

  const state = req.parsedUrl.searchParams.get('state')
  const clientId = req.parsedUrl.searchParams.get('client_id')

  let redirectUrl = `/login${state ? `?state=${encodeURIComponent(state)}` : ''}`

  if (clientId) {
    const client = await ClientRepository.getClient({ client_id: clientId }, { userContext: null })
    if (client && client.homePageUrl) {
      redirectUrl = client.homePageUrl
    }
  }
}

export function clearAuthCookies(res: ResponseContext) {
  res.cookies.set(SESSION_ID_COOKIE_NAME, undefined)
}

export async function buildContext(req: IncomingMessage, res: ServerResponse) {
  const cookies = new Cookies(req, res)

  const finalUrl = originalUrl(req)

  const requestContext: RequestContext = Object.assign(req, {
    cookies,
    parsedUrl: new URL(finalUrl.full),
    originalUrl: finalUrl.full
  })
  const responseContext: ResponseContext = Object.assign(res, { cookies })

  const context = await getUserContext(requestContext, responseContext)

  responseContext.user = context?.user
  responseContext.session = context?.session
  responseContext.locals = { user: context?.user }

  requestContext.user = context?.user
  requestContext.session = context?.session

  return { requestContext, responseContext }
}
