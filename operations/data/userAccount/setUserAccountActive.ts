import Knex from 'knex'
import { IUserAccount } from '../../../foundation/types/types'

export async function setUserAccountActive(userAccountId: string, isActive = true, dataContext: Knex) {
	await dataContext<IUserAccount>('UserAccounts')
		.where({ userAccountId })
		.update({ isActive })
}
