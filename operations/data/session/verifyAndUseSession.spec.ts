import { verifyAndUseSession } from './verifyAndUseSession'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { Session } from '../../../foundation/models/Session'
import { createSession, SESSION_EXPIRATION_SECONDS } from './createSession'
import { getCacheContext, CacheContext } from '../../../foundation/context/getCacheContext'
import { DataContext } from '../../../foundation/context/getDataContext'
import { addSeconds } from 'date-fns'

let dataContext: DataContext
const cacheContext: CacheContext = getCacheContext()

describe('verifyAndUseSession', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})
	it('Should correctly return a session with matching id', async () => {
		const sessionData: Partial<Session> = {
			userAccountId: 'abc123',
			ipAddress: '1.1.1.1'
		}
		try {
			const createdSession = await createSession(sessionData, false, dataContext)

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
		} catch (err) {
			console.error(err)
		}
	})
})
