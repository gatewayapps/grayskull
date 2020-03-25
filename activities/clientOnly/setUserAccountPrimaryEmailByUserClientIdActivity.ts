import { IRequestContext } from '../../foundation/context/prepareContext'
import { getUserClientByUserClientId } from '../../operations/data/userClient/getUserClientByUserClientId'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { getEmailAddressByEmailAddress } from '../../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { createEmailAddress } from '../../operations/data/emailAddress/createEmailAddress'
import { ensureAuthenticated } from '../../operations/logic/ensureAuthenticated'
import { ensureAdministrator } from '../../operations/logic/ensureAdministrator'

export async function setUserAccountPrimaryEmailByUserClientIdActivity(
	userClientId: string,
	emailAddress: string,
	context: IRequestContext
) {
	ensureAuthenticated(context)

	const userClient = await getUserClientByUserClientId(userClientId, context.dataContext)
	if (!userClient) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `User has not authorized this client`)
	}

	if (userClient.userAccountId !== context.user?.userAccountId) {
		ensureAdministrator(context)
	}

	const emailAddressRecord = await getEmailAddressByEmailAddress(emailAddress, context.dataContext)
	if (emailAddressRecord && emailAddressRecord.userAccountId !== userClient.userAccountId) {
		throw new GrayskullError(GrayskullErrorCode.EmailAlreadyRegistered, `That email address is already in use`)
	}

	await createEmailAddress(emailAddress, userClient.userAccountId, context.dataContext, true, true)
}
