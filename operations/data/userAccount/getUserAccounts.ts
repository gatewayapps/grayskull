import Knex from 'knex'
import { IUserAccount } from '../../../foundation/types/types'

export async function getUserAccounts(dataContext: Knex) {
	const records = await dataContext<IUserAccount>('UserAccounts')
		.where({ isActive: true })
		.orderBy('lastName', 'asc')
		.orderBy('firstName', 'asc')
		.select('*')

	return records.map((r) => {
		delete r.passwordHash
		// eslint-disable-next-line no-console
		console.log(r)
		return r
	})
}
