/* eslint-disable @typescript-eslint/no-explicit-any */
import { Session } from '../../foundation/models/Session'

import Cookies from 'cookies'

import { NextApiRequest, NextApiResponse } from 'next'

import { UserContext } from '../../foundation/context/getUserContext'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { validateAndDecodeAccessToken } from './validateAndDecodeAccessToken'
import { deleteSession } from '../data/session/deleteSession'

export type RequestContext = NextApiRequest & {
	cookies: any
	parsedUrl: URL
	originalUrl: string
	session?: Session
	user?: any
}
export type ResponseContext = NextApiResponse & {
	cookies: any
	session?: Session
	user?: UserContext
	locals?: any
}

export async function getClientRequestOptionsFromRequest(context: IRequestContext) {
	try {
		const auth = context.req.headers.authorization
		if (!auth) {
			throw new Error('Missing authorization header')
		}
		const authParts = auth.split(' ')
		const accessToken = authParts[1]
		return await validateAndDecodeAccessToken(accessToken, context)
	} catch {
		return undefined
	}
}

export const ACCESS_TOKEN_COOKIE_NAME = 'at'
export const SESSION_ID_COOKIE_NAME = 'sid'

export interface IAuthState {
	returnPath: string
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

export function setAuthCookies(res: ResponseContext, session: Session) {
	res.cookies.set(SESSION_ID_COOKIE_NAME, session.sessionId, { httpOnly: true, expires: session.expiresAt })
}

export function getAuthCookies(req: RequestContext) {
	const sessionId = req.cookies.get(SESSION_ID_COOKIE_NAME)
	return {
		sessionId
	}
}
export function clearAuthCookies(res: ResponseContext) {
	res.cookies.set(SESSION_ID_COOKIE_NAME, undefined)
}

export async function doLogout(context: IRequestContext) {
	const cookies = new Cookies(context.req, context.res)
	context.req.cookies = cookies
	context.res.cookies = cookies

	const { sessionId } = getAuthCookies(context.req)
	if (sessionId) {
		await deleteSession(sessionId, context.dataContext)
	}
	clearAuthCookies(context.res)
}
