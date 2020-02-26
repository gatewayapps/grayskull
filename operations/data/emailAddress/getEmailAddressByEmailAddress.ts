import { DataContext } from '../../../foundation/context/getDataContext'

export async function getEmailAddressByEmailAddress(emailAddress: string, dataContext: DataContext) {
	const emailAddressRecord = await dataContext.EmailAddress.findOne({
		where: {
			emailAddress
		}
	})

	return emailAddressRecord
}
