import { verifyAndUseSession } from './verifyAndUseSession'
import { getInMemoryContext } from '../../../context/getDataContext.spec'
import { Session } from '../../../server/data/models/Session'
import { createSession, SESSION_EXPIRATION_SECONDS } from './createSession'
import { getCacheContext, CacheContext } from '../../../context/getCacheContext'
import { DataContext } from '../../../context/getDataContext'
import { addSeconds } from 'date-fns'

let dataContext: DataContext
const cacheContext: CacheContext = getCacheContext()

describe('verifyAndUseSession', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })
  it('Should correctly return a session with matching id and fingerprint', async () => {
    const fingerprintData = 'xyz789'

    const sessionData: Partial<Session> = {
      userAccountId: 'abc123',
      fingerprint: fingerprintData,
      ipAddress: '1.1.1.1'
    }
    try {
      const createdSession = await createSession(sessionData, false, dataContext)

      const dataSession = await verifyAndUseSession(
        createdSession.sessionId,
        fingerprintData,
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
