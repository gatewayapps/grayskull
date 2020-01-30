import { getInMemoryContext } from '../foundation/context/getDataContext.spec'

import { registerUserAccountActivity } from './registerUserAccountActivity'
import { DataContext } from '../foundation/context/getDataContext'
import { CacheContext, getCacheContext } from '../foundation/context/getCacheContext'
let dataContext: DataContext
let cacheContext: CacheContext

jest.mock('../operations/data/userAccount/getUserAccountByEmailAddress', () => ({
  getUserAccountByEmailAddress: () => true
}))

describe('registerUserAccountActivity', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    cacheContext = getCacheContext()
  })
  it('Should throw an error if a user account exists with the given emailAddress', async () => {
    expect(
      registerUserAccountActivity(
        {
          firstName: '',
          lastName: '',
          client_id: '',
          confirm: '',
          password: '',
          emailAddress: '',
          otpSecret: ''
        },
        dataContext,
        cacheContext
      )
    ).rejects.toThrow()
  })
})
