import { GrayskullErrorCode, GrayskullError } from '../../../foundation/errors/GrayskullError'
import Knex from 'knex'
import { IEmailAddress } from '../../../foundation/types/types'

export async function setEmailAddressVerified(emailAddress: string, dataContext: Knex) {
	const emailRecord = await dataContext<IEmailAddress>('EmailAddresses')
		.where({ emailAddress, verified: false })
		.select('*')
		.first()
	if (!emailRecord) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailVerificationCode,
			`Unable to verify e-mail address '${emailAddress}'.  Either it is already verified, or it has not been added.`
		)
	} else {
		await dataContext<IEmailAddress>('EmailAddresses')
			.where({
				emailAddress
			})
			.update({ verified: true, updatedAt: new Date() })

		return await dataContext<IEmailAddress>('EmailAddresses')
			.where({ emailAddress, verified: true })
			.select('*')
			.first()
	}
}
