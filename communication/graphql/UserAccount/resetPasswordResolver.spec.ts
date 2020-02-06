jest.mock('../../../activities/sendResetPasswordEmail', () => ({
  sendResetPasswordEmail: () => true
}))
import { resetPasswordResolver } from './resetPasswordResolver'
import { default as sendResetPasswordActivity } from '../../../activities/sendResetPasswordEmail'

describe('resetPasswordResolver', () => {
  it('should call the sendResetPasswordEmail activity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(sendResetPasswordActivity, 'sendResetPasswordEmail')

    await resetPasswordResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
