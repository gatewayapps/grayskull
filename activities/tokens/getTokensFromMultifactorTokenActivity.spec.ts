jest.mock('./getTokensActivity', () => ({
	getTokensActivity: () => {
		accessToken: true
	}
}))
import Knex from 'knex'

import { IUserAccount, IClient, IUserClient } from '../../foundation/types/types'
import { getInMemoryContext } from '../../foundation/context/getDataContext.spec'
import { createTestClient } from '../../operations/data/client/createClient.spec'
import { createTestUserAccount } from '../../operations/data/userAccount/createUserAccount.spec'

import { createEmailAddress } from '../../operations/data/emailAddress/createEmailAddress'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { createUserClient } from '../../operations/data/userClient/createUserClient'
import { getTokensFromMultifactorTokenActivity } from './getTokensFromMultifactorTokenActivity'
import { createChallengeToken } from '../../operations/logic/createChallengeToken'
import { generateBackupMultifactorCode } from '../../operations/data/userAccount/generateBackupMultifactorCode'

let dataContext: Knex

let passwordUser: IUserAccount
let otpUser: IUserAccount
let otpUserClient: IUserClient
let testClient: IClient

describe('getTokensFromMultifactorTokenActivity', () => {
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
		otpUserClient = (await createUserClient(
			otpUser.userAccountId,
			testClient.client_id,
			['openid', 'offline_access'],
			[],
			dataContext
		)) as IUserClient
	})

	it('Should throw an error if passed an invalid clientId', async () => {
		let failed = false
		try {
			await getTokensFromMultifactorTokenActivity('INVALID-CLIENT', 'challenge_token', 'otp_token', {
				dataContext
			} as IRequestContext)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should throw an error if passed an invalid challenge_token', async () => {
		let failed = false
		try {
			await getTokensFromMultifactorTokenActivity(testClient.client_id, 'CHALLENGE_TOKEN', 'ot-token', {
				dataContext
			} as IRequestContext)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should call getTokensActivity if passed valid challenge_token and otp_token values', async () => {
		const getTokensActivity = require('./getTokensActivity')

		const getTokensSpy = jest.spyOn(getTokensActivity, 'getTokensActivity')

		const challengeToken = await createChallengeToken(
			'otpUser@test.com',
			otpUserClient!.userClientId,
			['openid'],
			testClient.secret
		)

		const otpToken = await generateBackupMultifactorCode('otpUser@test.com', otpUser.otpSecret!, dataContext)

		await getTokensFromMultifactorTokenActivity(testClient.client_id, otpToken, challengeToken, {
			dataContext
		} as IRequestContext)

		expect(getTokensSpy).toBeCalledTimes(1)
	})
})
