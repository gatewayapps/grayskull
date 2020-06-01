import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function getEmailAddressesForUserAccountId(userAccountId: string, context: Knex, verifiedOnly = false) {
	const where = verifiedOnly ? { userAccountId, verified: true } : { userAccountId }

	return context<IEmailAddress>('EmailAddresses')
		.where(where)
		.select('*')
}
