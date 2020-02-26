jest.mock('../../../activities/validateResetPasswordTokenActivity', () => ({
	validateResetPasswordTokenActivity: () => true
}))
import { validateResetPasswordTokenResolver } from './validateResetPasswordTokenResolver'
const validateResetPasswordTokenActivity = require('../../../activities/validateResetPasswordTokenActivity')

describe('verifyEmailAddressResolver', () => {
	it('should call the validateResetPasswordToken activity', async () => {
		const context: any = {}
		const args: any = { data: { emailAddress: 'test@test.com', token: 'test' } }
		const obj: any = {}

		const resolverSpy = jest.spyOn(validateResetPasswordTokenActivity, 'validateResetPasswordTokenActivity')

		await validateResetPasswordTokenResolver(obj, args, context)

		expect(resolverSpy).toBeCalledTimes(1)
	})
})
