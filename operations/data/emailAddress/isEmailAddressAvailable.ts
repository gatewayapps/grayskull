import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function isEmailAddressAvailable(emailAddress: string, dataContext: Knex) {
	const record = await dataContext<IEmailAddress>('EmailAddresses')
		.where({ emailAddress })
		.select('*')
		.first()

	return !!!record
}
