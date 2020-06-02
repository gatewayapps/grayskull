import { UserContext } from '../../../foundation/context/getUserContext'
import Knex from 'knex'
import { IUserAccount } from '../../../foundation/types/types'

export async function deleteUserAccount(userAccountId: string, userContext: UserContext, context: Knex) {
	const userUpdate = await context<IUserAccount>('UserAccounts')
		.where({ userAccountId })
		.update({
			isActive: false,
			deletedAt: new Date(),
			deletedBy: userContext.userAccountId
		})

	return userUpdate
}
