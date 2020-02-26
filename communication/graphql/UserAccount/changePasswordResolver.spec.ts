jest.mock('../../../activities/changePasswordWithTokenActivity', () => ({
	changePasswordWithTokenActivity: () => true
}))

jest.mock('../../../activities/changePasswordWithOldPasswordActivity', () => ({
	changePasswordWithOldPasswordActivity: () => true
}))

import { changePasswordResolver } from './changePasswordResolver'

const changePasswordWithTokenActivity = require('../../../activities/changePasswordWithTokenActivity')
const changePasswordWithOldPasswordActivity = require('../../../activities/changePasswordWithOldPasswordActivity')

describe('changePasswordResolver', () => {
	it('should call the changePasswordWithTokenActivity when called with a token', async () => {
		const context: any = {}
		const args: any = { data: { token: 'test' } }
		const obj: any = {}

		const resolverSpy = jest.spyOn(changePasswordWithTokenActivity, 'changePasswordWithTokenActivity')

		await changePasswordResolver(obj, args, context)

		expect(resolverSpy).toBeCalledTimes(1)
	})

	it('should call the changePasswordWithOldPasswordActivity when called with a token', async () => {
		const context: any = {}
		const args: any = { data: {} }
		const obj: any = {}

		const resolverSpy = jest.spyOn(changePasswordWithOldPasswordActivity, 'changePasswordWithOldPasswordActivity')
		await changePasswordResolver(obj, args, context)

		expect(resolverSpy).toBeCalledTimes(1)
	})
})
