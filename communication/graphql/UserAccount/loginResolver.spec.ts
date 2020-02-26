jest.mock('../../../activities/authenticateUserActivity', () => ({
  authenticateUserActivity: () => {
    return {
      sessionId: 'abc'
    }
  }
}))
import { loginResolver } from './loginResolver'
const authenticateUserActivity = require('../../../activities/authenticateUserActivity')

describe('loginResolver', () => {
  it('should call the authenticateUser activity', async () => {
    const context: any = {}
    const args: any = { data: { password: '', emailAddress: 'test@test.com' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(authenticateUserActivity, 'authenticateUserActivity')

    await loginResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
