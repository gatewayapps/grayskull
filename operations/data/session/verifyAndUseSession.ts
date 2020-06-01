import { CacheContext } from '../../../foundation/context/getCacheContext'

import { addSeconds } from 'date-fns'

import { SESSION_EXPIRATION_SECONDS } from './createSession'
import { ISession, IUserAccount } from '../../../foundation/types/types'
import Knex from 'knex'

/**
 * @description Attempts to find a matching session in the cache context.  If no session is cached, find it in the data context and cache it
 * @param sessionId
 * @param dataContext
 * @param cacheContext
 */
export async function verifyAndUseSession(
	sessionId: string,
	dataContext: Knex,
	cacheContext: CacheContext
): Promise<ISession | null> {
	if (!sessionId) {
		return null
	}

	const cacheKey = `SESSION_${sessionId}`
	const NOW = new Date()

	const cachedSession = cacheContext.getValue<ISession>(cacheKey)
	if (cachedSession && cachedSession.expiresAt > NOW) {
		return cachedSession
	}

	const session = await dataContext<ISession>('Sessions')
		.where({ sessionId })
		.select('*')
		.first()
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
	await dataContext<ISession>('Sessions')
		.where({ sessionId })
		.update({ lastUsedAt: NOW })

	await dataContext<IUserAccount>('UserAccounts')
		.where({ userAccountId: session.userAccountId })
		.update({ lastActive: NOW })

	await cacheContext.setValue(cacheKey, session, 30)

	return session
}
