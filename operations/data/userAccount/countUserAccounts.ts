import Knex from 'knex'
import { IUserAccount } from '../../../foundation/types/types'

export async function countUserAccounts(context: Knex) {
	return await context<IUserAccount>('UserAccounts').count()
}
