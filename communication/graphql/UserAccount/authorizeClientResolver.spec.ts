jest.mock('../../../activities/validateRedirectUriActivity', () => ({
	validateRedirectUriActivity: () => {
		return true
	}
}))

jest.mock('../../../activities/generateAuthorizationRedirectActivity', () => ({
	generateAuthorizationRedirectActivity: () => 'test'
}))

jest.mock('../../../activities/verifyUserScopesForClientActivity', () => ({
	verifyUserScopesForClientActivity: () => 'test'
}))

const validateRedirectUriActivity = require('../../../activities/validateRedirectUriActivity')
const generateAuthorizationRedirectActivity = require('../../../activities/generateAuthorizationRedirectActivity')
const verifyUserScopesForClientActivity = require('../../../activities/verifyUserScopesForClientActivity')

import { authorizeClientResolver } from './authorizeClientResolver'

describe('authorizeClientResolver', () => {
	it('should call the verifyEmailAddress activity', async () => {
		const context: any = { user: true }
		const args: any = { data: { emailAddress: 'test@test.com', code: 'test', responseType: 'code', scope: 'profile' } }
		const obj: any = {}

		const validateRedirectUriSpy = jest.spyOn(validateRedirectUriActivity, 'validateRedirectUriActivity')
		const generateAuthorizationRedirectSpy = jest.spyOn(
			generateAuthorizationRedirectActivity,
			'generateAuthorizationRedirectActivity'
		)
		const verifyUserScopesForClientSpy = jest.spyOn(
			verifyUserScopesForClientActivity,
			'verifyUserScopesForClientActivity'
		)

		await authorizeClientResolver(obj, args, context)
		expect(validateRedirectUriSpy).toHaveBeenCalledTimes(1)

		expect(generateAuthorizationRedirectSpy).toBeCalledTimes(1)
		expect(verifyUserScopesForClientSpy).toBeCalledTimes(1)
	})
	it('should throw an error if not passed valid scopes', async () => {
		const context: any = { user: true }
		const args: any = { data: { emailAddress: 'test@test.com', code: 'test', responseType: 'code' } }
		const obj: any = {}
		let failed = false
		try {
			await authorizeClientResolver(obj, args, context)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})
})
