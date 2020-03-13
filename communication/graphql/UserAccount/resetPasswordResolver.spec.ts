jest.mock('../../../activities/authentication/sendResetPasswordEmailActivity', () => ({
	sendResetPasswordEmailActivity: () => true
}))
import { resetPasswordResolver } from './resetPasswordResolver'
const sendResetPasswordActivity = require('../../../authentication/activities/sendResetPasswordEmailActivity')

describe('resetPasswordResolver', () => {
	it('should call the sendResetPasswordEmail activity', async () => {
		const context: any = {}
		const args: any = { data: { emailAddress: 'test@test.com' } }
		const obj: any = {}

		const resolverSpy = jest.spyOn(sendResetPasswordActivity, 'sendResetPasswordEmailActivity')

		await resetPasswordResolver(obj, args, context)

		expect(resolverSpy).toBeCalledTimes(1)
	})
})
