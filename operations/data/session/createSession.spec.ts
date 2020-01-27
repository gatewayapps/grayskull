import { DataContext } from '../../../context/getDataContext'
import { getInMemoryContext } from '../../../context/getDataContext.spec'

import { createSession } from './createSession'
import { Session } from '../../../server/data/models/Session'

let dataContext: DataContext

describe('createSession', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })

  it('Should correctly create a session', async () => {
    const sessionData: Partial<Session> = {
      userAccountId: 'abc123',
      fingerprint: 'xyz789',
      ipAddress: '1.1.1.1'
    }

    const createdSession = await createSession(sessionData, true, dataContext)
    expect(createdSession).toBeDefined()

    const sessionFromData = await dataContext.Session.findOne({ where: { sessionId: createdSession.sessionId } })

    expect(sessionFromData).toBeDefined()
    if (sessionFromData) {
      expect(sessionFromData.ipAddress).toEqual(sessionData.ipAddress)
      expect(sessionFromData.fingerprint).toEqual(sessionData.fingerprint)
      expect(sessionFromData.userAccountId).toEqual(sessionData.userAccountId)
    }
  })
})
