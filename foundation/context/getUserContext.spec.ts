import { getUserContext } from './getUserContext'
import { getCacheContext, CacheContext } from './getCacheContext'
import { DataContext } from './getDataContext'

import { createTestUserAccount } from '../../operations/data/userAccount/createUserAccount.spec'
import { createSession } from '../../operations/data/session/createSession'
import { getInMemoryContext } from './getDataContext.spec'

import { UserAccount } from '../models/UserAccount'
import { Session } from '../models/Session'

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
    const userContext = await getUserContext(testSession.sessionId, 'xyz789', dataContext, cacheContext, {
      Server: { baseUrl: 'http://127.0.0.1' }
    } as any)

    expect(userContext).toBeDefined()
    if (userContext) {
      expect(userContext.firstName).toEqual(testUser.firstName)
      expect(userContext.lastName).toEqual(testUser.lastName)
      expect(userContext.userAccountId).toEqual(testUser.userAccountId)
      expect(userContext.emailAddress).toEqual('')
      expect(userContext.passwordHash).toBeUndefined()
    }
  })

  it('Should return undefined for invalid session id', async () => {
    const userContext = await getUserContext('abc123', 'xyz789', dataContext, cacheContext, {
      Server: { baseUrl: 'http://127.0.0.1' }
    } as any)
    expect(userContext).toBeUndefined()
  })
})
