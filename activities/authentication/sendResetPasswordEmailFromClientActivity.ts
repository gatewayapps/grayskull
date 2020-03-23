import { IRequestContext } from '../../foundation/context/prepareContext'
import { getUserAccountByEmailAddress } from '../../operations/data/userAccount/getUserAccountByEmailAddress'
import { getClient } from '../../operations/data/client/getClient'
import { isValidClientRedirectUri } from '../../operations/logic/isValidClientRedirectUri'

export async function sendResetPasswordEmailFromClientActivity(
	emailAddress: string,
	clientId: string,
	redirectUri: string,
	context: IRequestContext
) {
	const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext, false)
	if (!userAccount) {
		return
	}
	const client = await getClient(clientId, context.dataContext, false)
	if (!client) {
		return
	}

	const isValidRedirect = isValidClientRedirectUri(client, redirectUri)
	if (!isValidRedirect) {
		return
	}
}
