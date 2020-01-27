import { verifyPassword } from './verifyPassword'
import { DataContext } from '../../../context/getDataContext'
import { getInMemoryContext } from '../../../context/getDataContext.spec'
import { createUserAccount } from '../userAccount/createUserAccount'
import { CacheContext, getCacheContext } from '../../../context/getCacheContext'
let dataContext: DataContext
let cacheContext: CacheContext

describe('verifyPassword', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    cacheContext = getCacheContext()
  })
  it('Should throw when given an invalid user account id', async () => {
    expect(verifyPassword('abc123', 'testpass', dataContext, cacheContext)).rejects.toThrow()
  })
  it('Should return false when passed a valid user accountId and invalid password', async () => {
    const createdUser = await createUserAccount(
      { firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
      'password1',
      dataContext
    )

    const passwordVerified = await verifyPassword(createdUser.userAccountId, 'wrongPassword', dataContext, cacheContext)
    expect(passwordVerified).toEqual(false)
  })
  it('Should return true when passed a valid userAccountId and password', async () => {
    const createdUser = await createUserAccount(
      { firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
      'password1',
      dataContext
    )

    const passwordVerified = await verifyPassword(createdUser.userAccountId, 'password1', dataContext, cacheContext)
    expect(passwordVerified).toEqual(true)
  })
})
