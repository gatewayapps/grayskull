import Knex from 'knex'
import { IPhoneNumber } from '../../../foundation/types/types'

export async function getPhoneNumberById(id: string, dataContext: Knex) {
	return await dataContext<IPhoneNumber>('PhoneNumbers')
		.where({ phoneNumberId: id })
		.select('*')
		.first()
}
