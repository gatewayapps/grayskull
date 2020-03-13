import Knex from 'knex'
import { getInMemoryContext } from '../../foundation/context/getDataContext.spec'
import { getCacheContext, CacheContext } from '../../foundation/context/getCacheContext'
import { createTestUserAccount } from '../../operations/data/userAccount/createUserAccount.spec'
import { IUserAccount, IClient } from '../../foundation/types/types'
import { createTestClient } from '../../operations/data/client/createClient.spec'
import { getTokensActivity } from './getTokensActivity'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { createUserClient } from '../../operations/data/userClient/createUserClient'

let dataContext: Knex
let cacheContext: CacheContext
let authorizedUser: IUserAccount
let unauthorizedUser: IUserAccount
let restrictedUser: IUserAccount
let testClient: IClient

describe('getTokensActivity', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		cacheContext = getCacheContext()

		authorizedUser = await createTestUserAccount(dataContext)
		unauthorizedUser = await createTestUserAccount(dataContext)
		restrictedUser = await createTestUserAccount(dataContext)
		testClient = await createTestClient(dataContext)

		await createUserClient(
			authorizedUser.userAccountId,
			testClient.client_id,
			['openid', 'offline_access'],
			[],
			dataContext
		)

		await createUserClient(
			restrictedUser.userAccountId,
			testClient.client_id,
			[],
			['openid', 'offline_access'],
			dataContext
		)
	})
	it('Should throw an error if a user has not authorized a client', async () => {
		let failed = false
		try {
			await getTokensActivity(unauthorizedUser.userAccountId, testClient.client_id, [], {
				dataContext,
				cacheContext
			} as IRequestContext)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should throw an error if passed an invalid user account id', async () => {
		let failed = false
		try {
			await getTokensActivity('INVALID-USER', testClient.client_id, [], { dataContext } as IRequestContext)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should throw an error if passed an invalid client id', async () => {
		let failed = false
		try {
			await getTokensActivity(authorizedUser.userAccountId, 'INVALID-CLIENT', [], { dataContext } as IRequestContext)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should return an access token if a user has authorized a client', async () => {
		const accessTokenResponse = await getTokensActivity(authorizedUser.userAccountId, testClient.client_id, [], {
			dataContext,
			cacheContext,
			configuration: { Security: { accessTokenExpirationSeconds: 300 } }
		} as IRequestContext)
		expect(accessTokenResponse).toBeDefined()
		expect(accessTokenResponse.access_token).toBeDefined()
	})

	it('Should not return a refresh token if a user has NOT authorized a client with offline_access', async () => {
		const accessTokenResponse = await getTokensActivity(
			restrictedUser.userAccountId,
			testClient.client_id,
			['offline_access'],
			{
				dataContext,
				cacheContext,
				configuration: { Security: { accessTokenExpirationSeconds: 300 } }
			} as IRequestContext
		)

		expect(accessTokenResponse.refresh_token).toBeUndefined()
	})
	it('Should return a refresh token if a user has authorized a client with offline_access', async () => {
		const accessTokenResponse = await getTokensActivity(
			authorizedUser.userAccountId,
			testClient.client_id,
			['offline_access'],
			{
				dataContext,
				cacheContext,
				configuration: { Security: { accessTokenExpirationSeconds: 300 } }
			} as IRequestContext
		)

		expect(accessTokenResponse.refresh_token).toBeDefined()
	})

	it('Should not return an id_token if a user has NOT authorized a client with openid', async () => {
		const accessTokenResponse = await getTokensActivity(
			restrictedUser.userAccountId,
			testClient.client_id,
			['openid'],
			{
				dataContext,
				cacheContext,
				configuration: { Security: { accessTokenExpirationSeconds: 300 }, Server: { baseUrl: 'http://localhost' } }
			} as IRequestContext
		)

		expect(accessTokenResponse.id_token).toBeUndefined()
	})

	it('Should return an id_token if a user has authorized a client with openid', async () => {
		const accessTokenResponse = await getTokensActivity(
			authorizedUser.userAccountId,
			testClient.client_id,
			['openid'],
			{
				dataContext,
				cacheContext,
				configuration: { Security: { accessTokenExpirationSeconds: 300 }, Server: { baseUrl: 'http://localhost' } }
			} as IRequestContext
		)

		expect(accessTokenResponse.id_token).toBeDefined()
	})
})
