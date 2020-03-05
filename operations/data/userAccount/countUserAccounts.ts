import Knex from 'knex'
import { IUserAccount } from '../../../foundation/types/types'

export async function countUserAccounts(context: Knex) {
	const record = await context<IUserAccount>('UserAccounts').count('*', { as: 'userCounts' })
	return record[0]['userCounts'] as number
}
