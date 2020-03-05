import Knex from 'knex'
import { UserContext } from '../../../foundation/context/getUserContext'
import { IUserAccount } from '../../../foundation/types/types'
import { CacheContext } from '../../../foundation/context/getCacheContext'

export async function updateUserAccount(
	userAccountId,
	userAccountDetails: IUserAccount,
	dataContext: Knex,
	userContext: UserContext,
	cacheContext: CacheContext
) {
	userAccountDetails.updatedAt = new Date()
	userAccountDetails.updatedBy = userContext.userAccountId

	await dataContext<IUserAccount>('UserAccounts')
		.where({ userAccountId })
		.update(userAccountDetails)

	const cacheKey = `USER_${userAccountId}`
	cacheContext.clearValue(cacheKey)
}
