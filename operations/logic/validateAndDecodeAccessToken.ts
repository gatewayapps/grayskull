import { IRequestContext } from '../../foundation/context/prepareContext'
import { IAccessToken } from '../../foundation/types/tokens'
import jwt from 'jsonwebtoken'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { getUserClientByUserClientId } from '../data/userClient/getUserClientByUserClientId'
import { getClient } from '../data/client/getClient'
import { createUserContextForUserId } from '../../foundation/context/getUserContext'
import { IClientRequestOptions } from '../../foundation/models/IClientRequestOptions'

export async function validateAndDecodeAccessToken(
	accessToken: string,
	context: IRequestContext
): Promise<IClientRequestOptions> {
	const decoded: IAccessToken | null = jwt.decode(accessToken) as IAccessToken
	if (decoded === null) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid access token ${accessToken}`)
	}

	const userClient = await getUserClientByUserClientId(decoded.sub, context.dataContext)
	if (!userClient) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid userClientId ${decoded.sub}`)
	}
	const client = await getClient(userClient.client_id, context.dataContext, true)
	if (!client) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid userClientId ${userClient.client_id}`)
	}

	if (!jwt.verify(accessToken, client.secret)) {
		throw new GrayskullError(
			GrayskullErrorCode.NotAuthorized,
			`Access token did not verify: ${accessToken} for client ${client.client_id}`
		)
	}

	const userAccount = await createUserContextForUserId(
		userClient.userAccountId,
		context.dataContext,
		context.cacheContext,
		context.configuration
	)

	if (!userAccount) {
		throw new GrayskullError(
			GrayskullErrorCode.NotAuthorized,
			`Failed to create UserContext for ${userClient.userAccountId}`
		)
	}

	return {
		client: userClient,
		userAccount,
		accessToken: decoded
	}
}
