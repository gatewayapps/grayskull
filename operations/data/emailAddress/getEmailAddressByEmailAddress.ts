import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function getEmailAddressByEmailAddress(emailAddress: string, dataContext: Knex) {
	return await dataContext<IEmailAddress>('EmailAddresses')
		.where({ emailAddress })
		.select('*')
		.first()
}
