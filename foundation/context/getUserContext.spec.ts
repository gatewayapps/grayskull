import { getUserContext } from './getUserContext'
import { getCacheContext, CacheContext } from './getCacheContext'

import { createTestUserAccount } from '../../operations/data/userAccount/createUserAccount.spec'
import { createSession } from '../../operations/data/session/createSession'
import { getInMemoryContext } from './getDataContext.spec'
import { IUserAccount, ISession } from '../types/types'
import Knex from 'knex'

let dataContext: Knex
let testUser: IUserAccount
let testSession: ISession | undefined
const cacheContext: CacheContext = getCacheContext()

describe('getUserContext', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		testUser = await createTestUserAccount(dataContext)
		testSession = await createSession(
			{
				userAccountId: testUser.userAccountId,
				ipAddress: '1.1.1.1'
			},
			false,
			dataContext
		)
	})

	it('Should correctly return a user from a session id ', async () => {
		if (!testSession) {
			expect(1).toEqual(0)
			throw new Error('testSession not set')
		}
		const userContext = await getUserContext(testSession.sessionId, dataContext, cacheContext, {
			Server: { baseUrl: 'http://127.0.0.1' }
		} as any)

		expect(userContext).toBeDefined()
		if (userContext) {
			expect(userContext.firstName).toEqual(testUser.firstName)
			expect(userContext.lastName).toEqual(testUser.lastName)
			expect(userContext.userAccountId).toEqual(testUser.userAccountId)
			expect(userContext.emailAddress).toEqual('')
			expect(userContext.passwordHash).toBeUndefined()
		}
	})

	it('Should return undefined for invalid session id', async () => {
		const userContext = await getUserContext('abc123', dataContext, cacheContext, {
			Server: { baseUrl: 'http://127.0.0.1' }
		} as any)
		expect(userContext).toBeUndefined()
	})
})
