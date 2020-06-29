import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function modifyEmailAddress(emailAddressId: string, emailAddress: string, dataContext: Knex) {
	await dataContext<IEmailAddress>('emailAddresses')
		.where({ emailAddressId })
		.update({ emailAddress })
}
