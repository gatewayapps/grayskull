import { IRequestContext } from '../../foundation/context/prepareContext'
import { getUserAccountByEmailAddress } from '../../operations/data/userAccount/getUserAccountByEmailAddress'
import { getClient } from '../../operations/data/client/getClient'
import { isValidClientRedirectUri } from '../../operations/logic/isValidClientRedirectUri'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { randomBytes } from 'crypto'
import { cacheValue } from '../../operations/data/persistentCache/cacheValue'
import { sendTemplatedEmail } from '../../operations/services/mail/sendEmailTemplate'

export async function sendResetPasswordEmailFromClientActivity(
	emailAddress: string,
	clientId: string,
	redirectUri: string,
	context: IRequestContext
) {
	const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext, false)
	if (!userAccount) {
		throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `No user found with email address ${emailAddress}`)
	}
	const client = await getClient(clientId, context.dataContext, false)
	if (!client) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `No client found for id ${clientId}`)
	}

	const isValidRedirect = isValidClientRedirectUri(client, redirectUri)
	if (!isValidRedirect) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid redirect`)
	}

	const token = randomBytes(32).toString('hex')
	const cacheKey = `RESET_PASSWORD:${emailAddress}`
	const cachedValue = `${userAccount.userAccountId}:${token}`
	const cacheTTL = 60 * 60 // 1 Hour

	await cacheValue(cacheKey, cachedValue, cacheTTL, context.dataContext)

	const resetPasswordLink = new URL(`${redirectUri}?emailAddress=${encodeURIComponent(emailAddress)}&token=${token}`)
		.href
	await sendTemplatedEmail(
		'resetPasswordTemplate',
		emailAddress,
		`${client.name} Password Reset`,
		{
			resetLink: resetPasswordLink,
			realmName: client.name,
			user: userAccount
		},
		context.configuration
	)
}
