import Knex from 'knex'
import { UserContext } from '../../../foundation/context/getUserContext'
import { IUserAccount } from '../../../foundation/types/types'
import { CacheContext } from '../../../foundation/context/getCacheContext'

export async function updateUserAccount(
	userAccountId,
	userAccountDetails: Partial<IUserAccount>,
	dataContext: Knex,
	userContext: UserContext | undefined,
	cacheContext: CacheContext
) {
	userAccountDetails.updatedAt = new Date()
	if (userContext) {
		userAccountDetails.updatedBy = userContext.userAccountId
	}

	await dataContext<IUserAccount>('UserAccounts')
		.where({ userAccountId })
		.update(userAccountDetails)

	const cacheKey = `USER_${userAccountId}`
	cacheContext.clearValue(cacheKey)
}
