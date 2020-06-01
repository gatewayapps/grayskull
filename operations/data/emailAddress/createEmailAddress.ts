import Knex from 'knex'
import { v4 as uuidv4 } from 'uuid'
import { IEmailAddress } from '../../../foundation/types/types'

export async function createEmailAddress(
	emailAddress: string,
	userAccountId: string,
	dataContext: Knex,
	primary,
	verified
) {
	const emailAddressId = uuidv4()

	if (primary) {
		await dataContext<IEmailAddress>('EmailAddresses')
			.where({ userAccountId, primary: true })
			.update({ primary: false })
	}

	await dataContext<IEmailAddress>('EmailAddresses').insert({
		emailAddressId,
		emailAddress,
		userAccountId,
		verified,
		primary,
		createdAt: new Date(),
		updatedAt: new Date()
	})

	return await dataContext<IEmailAddress>('EmailAddresses')
		.where({ emailAddressId })
		.select('*')
		.first()
}
