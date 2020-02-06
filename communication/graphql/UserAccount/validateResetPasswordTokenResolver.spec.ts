jest.mock('../../../activities/validateResetPasswordToken', () => ({
  validateResetPasswordToken: () => true
}))
import { validateResetPasswordTokenResolver } from './validateResetPasswordTokenResolver'
import { default as validateResetPasswordTokenActivity } from '../../../activities/validateResetPasswordToken'

describe('verifyEmailAddressResolver', () => {
  it('should call the validateResetPasswordToken activity', async () => {
    const context: any = {}
    const args: any = { data: { emailAddress: 'test@test.com', token: 'test' } }
    const obj: any = {}

    const resolverSpy = jest.spyOn(validateResetPasswordTokenActivity, 'validateResetPasswordToken')

    await validateResetPasswordTokenResolver(obj, args, context)

    expect(resolverSpy).toBeCalledTimes(1)
  })
})
