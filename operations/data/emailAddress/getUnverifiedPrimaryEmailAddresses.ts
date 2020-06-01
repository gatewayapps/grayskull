import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function getUnverifiedPrimaryEmailAddresses(dataContext: Knex) {
	return dataContext<IEmailAddress>('EmailAddresses')
		.where({ primary: true, verified: false })
		.select('*')
}
