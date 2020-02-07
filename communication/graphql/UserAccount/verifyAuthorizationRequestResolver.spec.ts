jest.mock('../../../activities/validateRedirectUri', () => ({
  validateRedirectUri: () => {
    return {
      userAccountId: 'abc'
    }
  }
}))
import { verifyAuthorizationRequestResolver } from './verifyAuthorizationRequestResolver'
import { default as validateRedirectUriActivity } from '../../../activities/validateRedirectUri'

describe('verifyAuthorizationRequestResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com', code: 'test' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(validateRedirectUriActivity, 'validateRedirectUri')

    await verifyAuthorizationRequestResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
