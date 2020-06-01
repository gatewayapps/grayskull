import { CacheContext } from '../../../foundation/context/getCacheContext'
import { IUserAccount } from '../../../foundation/types/types'
import Knex from 'knex'

export async function getUserAccount(
	userAccountId: string,
	dataContext: Knex,
	cacheContext?: CacheContext,
	includeSensitive = false
) {
	const cacheKey = `USER_${userAccountId}`
	if (cacheContext) {
		const cachedUser = cacheContext.getValue<IUserAccount>(cacheKey)
		if (cachedUser && !includeSensitive) {
			delete cachedUser.otpSecret
			delete cachedUser.passwordHash

			return cachedUser
		}
	}
	const user = await dataContext<IUserAccount>('UserAccounts')
		.where({
			userAccountId
		})
		.select('*')
		.first()
	if (user && !includeSensitive) {
		delete user.passwordHash
		delete user.otpSecret
	}

	if (user && cacheContext) {
		cacheContext.setValue(cacheKey, user, 30)
	}

	return user
}
