import { getUserContext } from './getUserContext'
import { getCacheContext, CacheContext } from './getCacheContext'
import { DataContext } from './getDataContext'

import { createTestUserAccount } from '../operations/data/user/createUserAccount.spec'
import { createSession } from '../operations/data/session/createSession'
import { getInMemoryContext } from './getDataContext.spec'

import { UserAccount } from '../server/data/models/UserAccount'
import { Session } from '../server/data/models/Session'

let dataContext: DataContext
let testUser: UserAccount
let testSession: Session
const cacheContext: CacheContext = getCacheContext()

describe('getUserContext', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    testUser = await createTestUserAccount(dataContext)
    testSession = await createSession(
      {
        userAccountId: testUser.userAccountId,
        fingerprint: 'xyz789',
        ipAddress: '1.1.1.1'
      },
      false,
      dataContext
    )
  })

  it('Should correctly return a user from a session id and fingerprint', async () => {
    const userContext = await getUserContext(testSession.sessionId, 'xyz789', dataContext, cacheContext)

    expect(userContext).toBeDefined()
    if (userContext) {
      expect(userContext.userAccount.firstName).toEqual(testUser.firstName)
      expect(userContext.userAccount.lastName).toEqual(testUser.lastName)
      expect(userContext.userAccount.userAccountId).toEqual(testUser.userAccountId)
      expect(userContext.primaryEmailAddress).toEqual('')
      expect(userContext.userAccount.passwordHash).toBeUndefined()
    }
  })

  it('Should return undefined for invalid session id', async () => {
    const userContext = await getUserContext('abc123', 'xyz789', dataContext, cacheContext)
    expect(userContext).toBeUndefined()
  })
})
