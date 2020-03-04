import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext } from '../../../foundation/context/getCacheContext'
import { IUserAccount } from '../../../foundation/types/types'

export async function getUserAccount(
	userAccountId: string,
	dataContext: DataContext,
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
	const user = await dataContext.UserAccount.where({
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
