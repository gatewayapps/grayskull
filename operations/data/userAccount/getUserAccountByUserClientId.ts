import Knex from 'knex'
import { IUserAccount } from '../../../foundation/types/types'

export async function getUserAccountByUserClientId(userClientId: string, dataContext: Knex) {
	return dataContext<IUserAccount>('UserAccounts')
		.select('*')
		.where('userAccountId IN (SELECT userAccountId FROM UserClients WHERE userClientId=?', [userClientId])
		.first()
}
