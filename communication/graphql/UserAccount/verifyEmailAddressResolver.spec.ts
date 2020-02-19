jest.mock('../../../activities/verifyEmailAddressActivity', () => ({
  verifyEmailAddressActivity: () => {
    return {
      userAccountId: 'abc'
    }
  }
}))
import { verifyEmailAddressResolver } from './verifyEmailAddressResolver'
import { default as verifyEmailAddressActivity } from '../../../activities/verifyEmailAddressActivity'

describe('verifyEmailAddressResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com', code: 'test' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(verifyEmailAddressActivity, 'verifyEmailAddressActivity')

    await verifyEmailAddressResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
