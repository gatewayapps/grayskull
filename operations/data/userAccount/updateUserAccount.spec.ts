import { updateUserAccount } from './updateUserAccount'

import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createUserAccount } from './createUserAccount'
import { CacheContext, getCacheContext } from '../../../foundation/context/getCacheContext'

import Knex from 'knex'
import { getUserAccount } from './getUserAccount'

let dataContext: Knex
let cacheContext: CacheContext

describe('updateUserAccount', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		cacheContext = getCacheContext()
	})

	it('Should correctly update a users account', async () => {
		const createdUser = await createUserAccount(
			{ firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
			'password1',
			dataContext,
			undefined
		)

		await updateUserAccount(
			createdUser.userAccountId,
			{ firstName: 'updatedFirstName' },
			dataContext,
			{ ...createdUser, emailAddress: '', emailAddressVerified: true },
			cacheContext
		)
		const savedUser = await getUserAccount(createdUser.userAccountId, dataContext, cacheContext, false)
		expect(savedUser).toBeDefined()
		if (savedUser) {
			expect(savedUser.firstName).toEqual('updatedFirstName')
		}
	})
	it('Should correctly update a users account without a user context', async () => {
		const createdUser = await createUserAccount(
			{ firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
			'password1',
			dataContext,
			undefined
		)

		await updateUserAccount(
			createdUser.userAccountId,
			{ firstName: 'updatedFirstName' },
			dataContext,
			undefined,
			cacheContext
		)
		const savedUser = await getUserAccount(createdUser.userAccountId, dataContext, cacheContext, false)
		expect(savedUser).toBeDefined()
		if (savedUser) {
			expect(savedUser.firstName).toEqual('updatedFirstName')
		}
	})
})
