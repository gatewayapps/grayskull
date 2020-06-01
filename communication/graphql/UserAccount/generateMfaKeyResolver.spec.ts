jest.mock('../../../activities/generateOTPSecretActivity', () => ({
	generateOtpSecretActivity: () => 'test'
}))
import { generateMfaKeyResolver } from './generateMfaKeyResolver'
const generateOTPSecretActivity = require('../../../activities/generateOTPSecretActivity')

describe('verifyEmailAddressResolver', () => {
	it('should call the verifyEmailAddress activity', async () => {
		const context: any = {}
		const args: any = { data: { emailAddress: 'test@test.com', code: 'test' } }
		const obj: any = {}

		const resolverSpy = jest.spyOn(generateOTPSecretActivity, 'generateOtpSecretActivity')

		await generateMfaKeyResolver(obj, args, context)

		expect(resolverSpy).toBeCalledTimes(1)
	})
})
