import { hash } from 'bcrypt'

import { CacheContext } from '../../../foundation/context/getCacheContext'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import Knex from 'knex'
import { getUserAccount } from './getUserAccount'
import { IUserAccount } from '../../../foundation/types/types'

export async function setUserAccountPassword(
	userAccountId: string,
	newPassword: string,
	dataContext: Knex,
	cacheContext: CacheContext
) {
	const userAccount = await getUserAccount(userAccountId, dataContext, undefined, true)
	if (userAccount) {
		const hashedPassword = await hash(newPassword, 10)
		await dataContext<IUserAccount>('UserAccounts')
			.where({ userAccountId })
			.update({ passwordHash: hashedPassword, lastPasswordChange: new Date() })

		const cacheKey = `USER_${userAccount.userAccountId}`
		cacheContext.clearValue(cacheKey)
	} else {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidUserAccountId,
			`Attempted to change the password for user ${userAccountId}, which does not exist`
		)
	}
}
