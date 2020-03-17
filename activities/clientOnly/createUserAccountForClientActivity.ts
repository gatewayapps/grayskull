import { IAuthorizedUser } from '../../foundation/types/shared'
import { createUserAccount } from '../../operations/data/userAccount/createUserAccount'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { createEmailAddress } from '../../operations/data/emailAddress/createEmailAddress'
import { isEmailAddressAvailable } from '../../operations/data/emailAddress/isEmailAddressAvailable'
import { verifyPasswordStrength } from '../../operations/logic/verifyPasswordStrength'
import { getClient } from '../../operations/data/client/getClient'
import { createUserClient } from '../../operations/data/userClient/createUserClient'
import { getAuthorizedUserForClient } from '../../operations/data/client/getAuthorizedUserForClient'
import { Permissions } from '../../foundation/constants/permissions'

export async function createUserAccountForClientActivity(
	userData: Pick<
		IAuthorizedUser,
		'given_name' | 'family_name' | 'gender' | 'nickname' | 'picture' | 'email' | 'birthday'
	>,
	password: string,
	clientId: string,
	context: IRequestContext
) {
	const emailAddressAvailable = await isEmailAddressAvailable(userData.email, context.dataContext)
	if (!emailAddressAvailable) {
		throw new Error(`Email address ${userData.email} is not available`)
	}

	const passwordValidated = verifyPasswordStrength(password, context.configuration.Security)
	if (!passwordValidated.success) {
		throw new Error(passwordValidated.validationErrors!.join('. '))
	}

	const client = await getClient(clientId, context.dataContext)
	if (!client) {
		throw new Error('Invalid client id')
	}

	const userAccount = await createUserAccount(
		{
			birthday: userData.birthday,
			firstName: userData.given_name,
			lastName: userData.family_name,
			gender: userData.gender,
			displayName: userData.nickname,
			profileImageUrl: userData.picture,
			permissions: Permissions.User,
			otpEnabled: false,
			isActive: true
		},
		password,
		context.dataContext
	)
	if (!userAccount) {
		throw new Error('Failed to create user account')
	}

	await createEmailAddress(userData.email, userAccount.userAccountId, context.dataContext, true, true)
	const userClient = await createUserClient(
		userAccount.userAccountId,
		clientId,
		JSON.parse(client.scopes),
		[],
		context.dataContext
	)
	if (!userClient) {
		throw new Error('Failed to create user client')
	}

	return await getAuthorizedUserForClient(userClient?.userClientId, clientId, context.dataContext)
}
