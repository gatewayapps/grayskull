import Knex from 'knex'
import { IPhoneNumber } from '../../../foundation/types/types'

export async function getPrimaryPhoneNumberForUserAccount(userAccountId: string, dataContext: Knex) {
	return await dataContext<IPhoneNumber>('PhoneNumbers')
		.where({ userAccountId, verified: true, primary: true })
		.select('*')
		.first()
}
