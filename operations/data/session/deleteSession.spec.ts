import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'

import { createSession } from './createSession'
import { Session } from '../../../foundation/models/Session'
import { deleteSession } from './deleteSession'

let dataContext: DataContext

describe('deleteSession', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })

  it('should delete a session from the dataContext', async () => {
    const sessionData: Partial<Session> = {
      userAccountId: 'abc123',
      fingerprint: 'xyz789',
      ipAddress: '1.1.1.1'
    }

    const createdSession = await createSession(sessionData, true, dataContext)
    expect(createdSession).toBeDefined()

    await deleteSession(createdSession.sessionId, dataContext)

    const sessionFromContext = await dataContext.Session.findOne({ where: { sessionId: createdSession.sessionId } })
    expect(sessionFromContext).toBeNull()
  })
})
