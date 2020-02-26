jest.mock('../../../activities/validateRedirectUriActivity', () => ({
	validateRedirectUriActivity: () => {
		return {
			userAccountId: 'abc'
		}
	}
}))
import { verifyAuthorizationRequestResolver } from './verifyAuthorizationRequestResolver'
const validateRedirectUriActivity = require('../../../activities/validateRedirectUriActivity')

describe('verifyAuthorizationRequestResolver', () => {
	it('should call the verifyEmailAddress activity', async () => {
		const context: any = {}
		const args: any = { data: { emailAddress: 'test@test.com', code: 'test' } }
		const obj: any = {}

		const resolverSpy = jest.spyOn(validateRedirectUriActivity, 'validateRedirectUriActivity')

		await verifyAuthorizationRequestResolver(obj, args, context)

		expect(resolverSpy).toBeCalledTimes(1)
	})
})
