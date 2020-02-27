import { DataContext } from '../../../foundation/context/getDataContext'

export async function addPrimaryPhoneNumber(userAccountId: string, phoneNumber: string, dataContext: DataContext) {
	await dataContext.PhoneNumber.destroy({ where: { userAccountId }, force: true })
	await dataContext.PhoneNumber.create({
		userAccountId,
		phoneNumber,
		primary: true,
		verified: true
	})
}
