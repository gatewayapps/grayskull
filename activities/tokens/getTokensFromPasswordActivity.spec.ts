jest.mock('./getTokensActivity', () => ({
	getTokensActivity: () => {
		accessToken: true
	}
}))
import Knex from 'knex'

import { IUserAccount, IClient } from '../../foundation/types/types'
import { getInMemoryContext } from '../../foundation/context/getDataContext.spec'
import { createTestClient } from '../../operations/data/client/createClient.spec'
import { createTestUserAccount } from '../../operations/data/userAccount/createUserAccount.spec'
import { getTokensFromPasswordActivity } from './getTokensFromPasswordActivity'
import { createEmailAddress } from '../../operations/data/emailAddress/createEmailAddress'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { createUserClient } from '../../operations/data/userClient/createUserClient'

let dataContext: Knex

let passwordUser: IUserAccount
let otpUser: IUserAccount

let testClient: IClient

describe('getTokensFromPasswordActivity', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()

		testClient = await createTestClient(dataContext)
		passwordUser = await createTestUserAccount(dataContext)
		otpUser = await createTestUserAccount(dataContext, { otpEnabled: true, otpSecret: 'abc123' })

		await createEmailAddress('passwordUser@test.com', passwordUser.userAccountId, dataContext, true, true)
		await createEmailAddress('otpUser@test.com', otpUser.userAccountId, dataContext, true, true)

		await createUserClient(
			passwordUser.userAccountId,
			testClient.client_id,
			['openid', 'offline_access'],
			[],
			dataContext
		)
		await createUserClient(otpUser.userAccountId, testClient.client_id, ['openid', 'offline_access'], [], dataContext)
	})

	it('Should throw an error if passed an invalid clientId', async () => {
		let failed = false
		try {
			await getTokensFromPasswordActivity('INVALID-CLIENT', testClient.secret, 'test@test.com', 'password', [], {
				dataContext
			} as IRequestContext)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should throw an error if passed an invalid clientSecret', async () => {
		let failed = false
		try {
			await getTokensFromPasswordActivity(
				testClient.client_id,
				'INVALID-SECRET',
				'passwordUser@test.com',
				'password',
				[],
				{
					dataContext
				} as IRequestContext
			)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should throw an error if passed an invalid email address', async () => {
		let failed = false
		try {
			await getTokensFromPasswordActivity(
				testClient.client_id,
				'INVALID-SECRET',
				'invalidEmail@test.com',
				'password',
				[],
				{
					dataContext
				} as IRequestContext
			)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should call getTokensActivity if passed correct values on password only user', async () => {
		const getTokensActivity = require('./getTokensActivity')

		const getTokensSpy = jest.spyOn(getTokensActivity, 'getTokensActivity')
		await getTokensFromPasswordActivity(
			testClient.client_id,
			testClient.secret,
			'passwordUser@test.com',
			'password',
			[],
			{ dataContext } as IRequestContext
		)
		expect(getTokensSpy).toBeCalledTimes(1)
	})

	it('Should not call getTokensActivity if passed correct values on otp user', async () => {
		const result = await getTokensFromPasswordActivity(
			testClient.client_id,
			testClient.secret,
			'otpUser@test.com',
			'password',
			[],
			{
				dataContext
			} as IRequestContext
		)
		expect(result.challenge).toBeDefined()
	})
})
