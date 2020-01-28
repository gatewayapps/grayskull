import { getInMemoryContext } from '../context/getDataContext.spec'

import { registerUserAccountActivity } from './registerUserAccountActivity'
import { DataContext } from '../context/getDataContext'
import { CacheContext, getCacheContext } from '../context/getCacheContext'
let dataContext: DataContext
let cacheContext: CacheContext

describe(registerUserAccountActivity, () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    cacheContext = getCacheContext()
  })
  it('Should throw an error if a user account exists with the given emailAddress', async () => {
    jest.mock('../operations/data/userAccount/getUserAccountByEmailAddress', () => ({
      getUserAccountByEmailAddress: () => true
    }))
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
    ).rejects.toThrowError()
  })
})
