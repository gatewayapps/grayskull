import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function getEmailAddressById(emailAddressId: string, dataContext: Knex) {
	return dataContext<IEmailAddress>('EmailAddresses')
		.where({ emailAddressId })
		.select('*')
		.first()
}
