import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function getEmailAddressesForUserAccountId(userAccountId: string, context: Knex) {
	return context<IEmailAddress>('EmailAddresses')
		.where({ userAccountId })
		.select('*')
}
