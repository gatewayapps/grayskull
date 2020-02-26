import { DataContext } from '../../../foundation/context/getDataContext'
import { GrayskullErrorCode, GrayskullError } from '../../../foundation/errors/GrayskullError'

export async function setEmailAddressVerified(emailAddress: string, dataContext: DataContext) {
	const resultSet = (await dataContext.EmailAddress.update(
		{
			verified: true,
			updatedAt: new Date()
		},
		{
			where: {
				emailAddress,
				verified: false
			},
			validate: false
		}
	)) as number[]
	if (resultSet[0] === 0) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailVerificationCode,
			`Unable to verify e-mail address '${emailAddress}'.  Either it is already verified, or it has not been added.`
		)
	} else {
		const emailAddressRecord = await dataContext.EmailAddress.findOne({ where: { emailAddress } })
		return emailAddressRecord
	}
}
