import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'

import { createUserAccount } from './createUserAccount'
import { IUserAccount } from '../../../foundation/types/types'
import Knex from 'knex'

let dataContext: Knex

export const TEST_USER_DATA: Partial<IUserAccount> = {
	firstName: 'Test',
	lastName: 'User',
	permissions: 0,
	otpEnabled: false,
	isActive: true
}

export async function createTestUserAccount(dataContext: Knex) {
	return await createUserAccount(TEST_USER_DATA, 'password', dataContext, undefined)
}

describe('createUserAccount', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('Should correctly create a user account', async () => {
		const createdUser = await createTestUserAccount(dataContext)
		expect(createdUser).toBeDefined()

		if (createdUser) {
			expect(createdUser.firstName).toEqual(TEST_USER_DATA.firstName)
			expect(createdUser.lastName).toEqual(TEST_USER_DATA.lastName)
		}
	})
})
