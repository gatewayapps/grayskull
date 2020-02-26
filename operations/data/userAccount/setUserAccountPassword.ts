import { hash } from 'bcrypt'
import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext } from '../../../foundation/context/getCacheContext'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function setUserAccountPassword(
	userAccountId: string,
	newPassword: string,
	dataContext: DataContext,
	cacheContext: CacheContext
) {
	const userAccount = await dataContext.UserAccount.findOne({
		where: {
			userAccountId
		}
	})
	if (userAccount) {
		const hashedPassword = await hash(newPassword, 10)
		await dataContext.UserAccount.update(
			{ passwordHash: hashedPassword, lastPasswordChange: new Date() },
			{ where: { userAccountId }, validate: false }
		)

		const cacheKey = `USER_${userAccount.userAccountId}`
		cacheContext.clearValue(cacheKey)
	} else {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidUserAccountId,
			`Attempted to change the password for user ${userAccountId}, which does not exist`
		)
	}
}
