import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import Knex from 'knex'
import { createTestUserAccount } from './createUserAccount.spec'
import { getUserAccount } from './getUserAccount'
import { getCacheContext } from '../../../foundation/context/getCacheContext'

let dataContext: Knex

describe('getUserContext', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('Should correctly return a user from the data context', async () => {
		const testUser = await createTestUserAccount(dataContext)
		const retrievedUser = await getUserAccount(testUser.userAccountId, dataContext, await getCacheContext(), true)
		if (retrievedUser) {
			expect(retrievedUser.firstName).toEqual(testUser.firstName)
		} else {
			expect(true).toBeFalsy()
		}
	})
})
