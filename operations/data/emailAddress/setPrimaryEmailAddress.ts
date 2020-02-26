import { DataContext } from '../../../foundation/context/getDataContext'

export async function setPrimaryEmailAddress(emailAddressId: string, userAccountId: string, dataContext: DataContext) {
	await dataContext.EmailAddress.update({ primary: false }, { where: { primary: true, userAccountId } })
	await dataContext.EmailAddress.update({ primary: true }, { where: { userAccountId, emailAddressId } })
}
