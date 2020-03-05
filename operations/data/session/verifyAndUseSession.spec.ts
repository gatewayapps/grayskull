import { verifyAndUseSession } from './verifyAndUseSession'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'

import { createSession, SESSION_EXPIRATION_SECONDS } from './createSession'
import { getCacheContext, CacheContext } from '../../../foundation/context/getCacheContext'

import { addSeconds } from 'date-fns'
import Knex from 'knex'
import { ISession } from '../../../foundation/types/types'

let dataContext: Knex
const cacheContext: CacheContext = getCacheContext()

describe('verifyAndUseSession', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})
	it('Should correctly return a session with matching id', async () => {
		const sessionData: Partial<ISession> = {
			userAccountId: 'abc123',
			ipAddress: '1.1.1.1'
		}
		try {
			const createdSession = await createSession(sessionData, false, dataContext)
			expect(createdSession).toBeDefined()
			if (createdSession) {
				const dataSession = await verifyAndUseSession(
					createdSession.sessionId,

					dataContext,
					cacheContext
				)
				expect(dataSession).toBeDefined()
				if (dataSession) {
					expect(dataSession.userAccountId).toEqual(sessionData.userAccountId)

					expect(dataSession.expiresAt.getTime()).toBeGreaterThan(new Date().getTime())

					expect(dataSession.expiresAt.getTime()).toBeLessThanOrEqual(
						addSeconds(new Date(), SESSION_EXPIRATION_SECONDS).getTime()
					)
				}
			}
		} catch (err) {
			console.error(err)
		}
	})
})
