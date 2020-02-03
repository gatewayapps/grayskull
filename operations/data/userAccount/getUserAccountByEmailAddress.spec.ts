import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { DataContext } from '../../../foundation/context/getDataContext'
import { createTestUserAccount } from './createUserAccount.spec'
import { createEmailAddress } from '../emailAddress/createEmailAddress'
import { getUserAccountByEmailAddress } from './getUserAccountByEmailAddress'
import { getCacheContext, CacheContext } from '../../../foundation/context/getCacheContext'
let dataContext: DataContext
let cacheContext: CacheContext

describe('getUserAccountByEmailAddress', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    cacheContext = getCacheContext()
  })

  it('should return a user account if given a valid email address', async () => {
    const createdUser = await createTestUserAccount(dataContext)
    await createEmailAddress('test@test.com', createdUser.userAccountId, dataContext, true, true)

    const userFromEmail = await getUserAccountByEmailAddress('test@test.com', dataContext, cacheContext)
    expect(userFromEmail).toBeDefined()
    if (userFromEmail) {
      expect(userFromEmail.userAccountId).toEqual(createdUser.userAccountId)
    }
  })
  it('should return null if given an invalid email address', async () => {
    const userFromEmail = await getUserAccountByEmailAddress('wrong@false.com', dataContext, cacheContext)
    expect(userFromEmail).toBeNull()
  })
  it('should throw if given a valid email address but no existing user account', async () => {
    await createEmailAddress('test2@test.com', 'abc123', dataContext, true, true)
    expect(getUserAccountByEmailAddress('test2@test.com', dataContext, cacheContext)).rejects.toThrow()
  })
})
