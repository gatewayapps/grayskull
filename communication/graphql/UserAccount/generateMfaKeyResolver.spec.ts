jest.mock('../../../activities/generateOTPSecret', () => ({
  generateOtpSecret: () => ('test')
}))
import { generateMfaKeyResolver } from './generateMfaKeyResolver'
import { default as generateOTPSecretActivity } from '../../../activities/generateOTPSecret'

describe('verifyEmailAddressResolver', () => {
  it('should call the verifyEmailAddress activity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com', code: 'test' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(generateOTPSecretActivity, 'generateOtpSecret')

    await generateMfaKeyResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
