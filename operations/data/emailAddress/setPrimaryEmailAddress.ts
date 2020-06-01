import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function setPrimaryEmailAddress(emailAddressId: string, userAccountId: string, dataContext: Knex) {
	await dataContext<IEmailAddress>('EmailAddresses')
		.where({ userAccountId, primary: true })
		.update({ primary: false, updatedAt: new Date() })
	await dataContext<IEmailAddress>('EmailAddresses')
		.where({ userAccountId, emailAddressId })
		.update({ primary: true })
}
