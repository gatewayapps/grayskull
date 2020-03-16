import { IRequestContext } from '../../foundation/context/prepareContext'
import { IAccessToken } from '../../foundation/types/tokens'
import jwt from 'jsonwebtoken'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { getUserClientByUserClientId } from '../data/userClient/getUserClientByUserClientId'
import { getClient } from '../data/client/getClient'
import { createUserContextForUserId, UserContext } from '../../foundation/context/getUserContext'
import { IClientRequestOptions } from '../../foundation/models/IClientRequestOptions'
import { IUserClient } from '../../foundation/types/types'

export async function validateAndDecodeAccessToken(
	accessToken: string,
	context: IRequestContext
): Promise<IClientRequestOptions> {
	const decoded: IAccessToken | null = jwt.decode(accessToken) as IAccessToken
	if (decoded === null) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid access token ${accessToken}`)
	}

	let clientId: string
	let userAccount: UserContext | undefined = undefined
	let userClient: IUserClient | undefined = undefined
	//This is a client access token
	if (decoded.sub.endsWith('@clients')) {
		clientId = decoded.sub.replace('@clients', '')
	} else {
		userClient = await getUserClientByUserClientId(decoded.sub, context.dataContext)
		if (!userClient) {
			throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid userClientId ${decoded.sub}`)
		}
		clientId = userClient.client_id
		userAccount = await createUserContextForUserId(
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
	}

	const client = await getClient(clientId, context.dataContext, true)
	if (!client) {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Invalid userClientId ${clientId}`)
	}

	if (!jwt.verify(accessToken, client.secret)) {
		throw new GrayskullError(
			GrayskullErrorCode.NotAuthorized,
			`Access token did not verify: ${accessToken} for client ${clientId}`
		)
	}

	return {
		userClient,
		userAccount,
		client,
		accessToken: decoded
	}
}
