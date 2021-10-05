import { getUserClient } from '../../operations/data/userClient/getUserClient'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { createUserContextForUserId } from '../../foundation/context/getUserContext'
import { ScopeMap } from '../../foundation/constants/scopes'
import { userClientHasAllowedScope } from '../../operations/logic/userClientHasAllowedScope'
import { createIDToken } from '../../operations/logic/createIDToken'
import { createRefreshToken } from '../../operations/data/refreshToken/createRefreshToken'
import { createAccessToken } from '../../operations/logic/createAccessToken'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { getClient } from '../../operations/data/client/getClient'
import { IRefreshToken } from '../../foundation/types/types'

export async function getTokensActivity(
	userAccountId: string,
	clientId: string,
	scopes: string[],
	context: IRequestContext
) {
	let id_token: string | undefined = undefined
	let refresh_token: IRefreshToken | undefined = undefined

	const userClient = await getUserClient(userAccountId, clientId, context.dataContext)
	if (!userClient) {
		throw new GrayskullError(
			GrayskullErrorCode.NotAuthorized,
			`User ${userAccountId} has not authorized client ${clientId}`
		)
	}

	const client = await getClient(clientId, context.dataContext, true)
	if (!client) {
		throw new GrayskullError(GrayskullErrorCode.InvalidClientId, `Unable to find client ${clientId}`)
	}

	const userContext = await createUserContextForUserId(
		userAccountId,
		context.dataContext,
		context.cacheContext,
		context.configuration
	)
	if (!userContext) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Unable to build user context for ${userAccountId}`)
	}

	if (scopes.includes(ScopeMap.openid.id) && userClientHasAllowedScope(userClient, ScopeMap.openid.id)) {
		id_token = await createIDToken(
			userContext,
			client,
			userClient,
			undefined,
			undefined,
			context.configuration,
			context.dataContext
		)
	}

	if (
		scopes.includes(ScopeMap.offline_access.id) &&
		userClientHasAllowedScope(userClient, ScopeMap.offline_access.id)
	) {
		refresh_token = await createRefreshToken(client.secret!, userClient.userClientId, undefined, context.dataContext)
	}

	const access_token = await createAccessToken(
		client,
		userClient,
		refresh_token,
		context.configuration,
		context.dataContext
	)
	return {
		access_token,
		id_token,
		expires_in: context.configuration.Security.accessTokenExpirationSeconds || 300,
		refresh_token: refresh_token ? refresh_token.token : undefined,
		token_type: 'Bearer'
	}
}
