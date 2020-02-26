import { DataContext } from '../../../foundation/context/getDataContext'

export async function createEmailAddress(
	emailAddress: string,
	userAccountId: string,
	dataContext: DataContext,
	primary,
	verified
) {
	return new dataContext.EmailAddress({
		emailAddress,
		userAccountId: userAccountId,
		verified,
		primary,
		createdAt: new Date(),
		updatedAt: new Date(),
		verificationSecret: ''
	}).save()
}
