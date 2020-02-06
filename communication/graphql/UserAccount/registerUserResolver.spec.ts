jest.mock('../../../activities/registerUser', () => ({
  registerUser: () => {
    return {
      userAccountId: 'abc'
    }
  }
}))

import { registerUserResolver } from './registerUserResolver'
import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext, getCacheContext } from '../../../foundation/context/getCacheContext'
import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { default as registerUserActivity } from '../../../activities/registerUser'
let dataContext: DataContext
let cacheContext: CacheContext

describe('registerUserResolver', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
    cacheContext = getCacheContext()
  })

  it('should call the registerUserActivity', async () => {
    const configuration: any = {}

    const userContext: any = { permissions: 1 }
    const registerUserSpy = jest.spyOn(registerUserActivity, 'registerUser')
    await registerUserResolver(
      {},
      { data: {} },
      {
        user: userContext,
        res: {},
        cacheContext,
        configuration,
        dataContext,
        req: { socket: { remoteAddress: '1.1.1.1' }, headers: { 'x-fingerprint': 'test' } }
      }
    )
    expect(registerUserSpy).toBeCalledTimes(1)
  })
})
