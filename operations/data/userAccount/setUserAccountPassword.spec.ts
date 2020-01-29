import { setUserAccountPassword } from './setUserAccountPassword'
import { DataContext } from '../../../foundation/context/getDataContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createUserAccount } from './createUserAccount'
import { CacheContext, getCacheContext } from '../../../foundation/context/getCacheContext'
import { verifyPassword } from './verifyPassword'

let dataContext: DataContext
let cacheContext: CacheContext

describe('setUserAccountPassword', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    cacheContext = getCacheContext()
  })

  it('Should correctly update a users account with a new password', async () => {
    const createdUser = await createUserAccount(
      { firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
      'password1',
      dataContext
    )

    const passwordVerified = await verifyPassword(createdUser.userAccountId, 'password1', dataContext, cacheContext)
    expect(passwordVerified).toEqual(true)

    await setUserAccountPassword(createdUser, 'password2', dataContext, cacheContext)
    expect(cacheContext.getValue(`USER_${createdUser.userAccountId}`)).toBeUndefined()

    const passwordVerified2 = await verifyPassword(createdUser.userAccountId, 'password1', dataContext, cacheContext)
    expect(passwordVerified2).toEqual(false)

    const passwordVerified3 = await verifyPassword(createdUser.userAccountId, 'password2', dataContext, cacheContext)
    expect(passwordVerified3).toEqual(true)
  })
})
