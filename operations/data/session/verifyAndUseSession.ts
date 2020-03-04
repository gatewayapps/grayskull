import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext } from '../../../foundation/context/getCacheContext'
import { Session } from '../../../foundation/models/Session'

import { addSeconds } from 'date-fns'

import { SESSION_EXPIRATION_SECONDS } from './createSession'

/**
 * @description Attempts to find a matching session in the cache context.  If no session is cached, find it in the data context and cache it
 * @param sessionId
 * @param dataContext
 * @param cacheContext
 */
export async function verifyAndUseSession(
	sessionId: string,
	dataContext: DataContext,
	cacheContext: CacheContext
): Promise<Session | null> {
	if (!sessionId) {
		return null
	}

	const cacheKey = `SESSION_${sessionId}`
	const NOW = new Date()

	const cachedSession = cacheContext.getValue<Session>(cacheKey)
	if (cachedSession && cachedSession.expiresAt > NOW) {
		return cachedSession
	}

	const session = await dataContext.Session.findOne({ where: { sessionId } })
	if (!session) {
		return null
	}

	if (session.expiresAt < NOW) {
		return null
	}

	const HALF_EXPIRATION = SESSION_EXPIRATION_SECONDS / 2
	if (session.expiresAt < addSeconds(NOW, HALF_EXPIRATION)) {
		session.expiresAt = addSeconds(NOW, SESSION_EXPIRATION_SECONDS)
	}
	session.lastUsedAt = NOW
	await session.save()

	cacheContext.setValue(cacheKey, session, 30)

	return session
}
