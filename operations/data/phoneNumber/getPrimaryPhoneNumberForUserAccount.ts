import { DataContext } from '../../../foundation/context/getDataContext'

export async function getPrimaryPhoneNumberForUserAccount(userAccountId: string, dataContext: DataContext) {
	return dataContext.PhoneNumber.findOne({
		where: {
			userAccountId,
			verified: true,
			primary: true
		}
	})
}
