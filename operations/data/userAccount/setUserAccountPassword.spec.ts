import { setUserAccountPassword } from './setUserAccountPassword'

import { getInMemoryContext } from '../../../foundation/context/getDataContext.spec'
import { createUserAccount } from './createUserAccount'
import { CacheContext, getCacheContext } from '../../../foundation/context/getCacheContext'
import { verifyPassword } from './verifyPassword'
import Knex from 'knex'

let dataContext: Knex
let cacheContext: CacheContext

describe('setUserAccountPassword', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		cacheContext = getCacheContext()
	})

	it('Should correctly update a users account with a new password', async () => {
		const createdUser = await createUserAccount(
			{ firstName: 'test', lastName: 'user', otpEnabled: false, isActive: true, permissions: 1 },
			'password1',
			dataContext,
			undefined
		)

		const passwordVerified = await verifyPassword(createdUser.userAccountId, 'password1', dataContext)
		expect(passwordVerified).toBeTruthy()

		await setUserAccountPassword(createdUser.userAccountId, 'password2', dataContext, cacheContext)
		expect(cacheContext.getValue(`USER_${createdUser.userAccountId}`)).toBeUndefined()

		const passwordVerified2 = await verifyPassword(createdUser.userAccountId, 'password1', dataContext)
		expect(passwordVerified2).toBeFalsy()

		const passwordVerified3 = await verifyPassword(createdUser.userAccountId, 'password2', dataContext)
		expect(passwordVerified3).toBeTruthy()
	})
})
