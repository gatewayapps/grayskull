import { DataContext } from '../../../foundation/context/getDataContext'
import { UserContext } from '../../../foundation/context/getUserContext'
import { IUserAccount } from '../../../foundation/types/types'
import { CacheContext } from '../../../foundation/context/getCacheContext'

export async function updateUserAccount(
	userAccountId,
	userAccountDetails: IUserAccount,
	context: DataContext,
	userContext: UserContext,
	cacheContext: CacheContext
) {
	const results = await context.UserAccount.update(
		{
			...userAccountDetails,
			updatedAt: new Date(),
			updatedBy: userContext.userAccountId
		},
		{ where: { userAccountId }, validate: false }
	)
	const cacheKey = `USER_${userAccountId}`
	cacheContext.clearValue(cacheKey)
	return results
}
