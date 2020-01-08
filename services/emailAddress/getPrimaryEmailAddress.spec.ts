import { getPrimaryEmailAddress } from './getPrimaryEmailAddress'
import { getInMemoryContext } from '../../context/getDataContext.spec'
import { DataContext } from '../../context/getDataContext'
import { createEmailAddress } from './createEmailAddress'
import { getCacheContext, CacheContext } from '../../context/getCacheContext'

let dataContext: DataContext
let cacheContext: CacheContext

describe('getPrimaryEmailAddress', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    cacheContext = getCacheContext()
  })

  it('Should return the primary email address record for a user account id', async () => {
    await createEmailAddress('test@test.com', 'abc123', dataContext, true, true)
    const primaryEmail = await getPrimaryEmailAddress('abc123', dataContext, cacheContext)
    expect(primaryEmail).toBeDefined()
    if (primaryEmail) {
      expect(primaryEmail.emailAddress).toEqual('test@test.com')
      expect(primaryEmail.userAccountId).toEqual('abc123')
      expect(primaryEmail.primary).toEqual(true)
    }
  })
})
