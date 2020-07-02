import { IUserClient, IConfiguration, IClient, IRefreshToken } from '../../foundation/types/types'

import { addSeconds } from 'date-fns'

import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'

import { IAccessToken } from '../../foundation/types/tokens'
import { signTokenForClient } from './signTokenForClient'
import Knex from 'knex'

export async function createAccessToken(
	client: IClient,
	userClient: IUserClient | undefined,
	refreshToken: IRefreshToken | undefined,
	configuration: IConfiguration,
	dataContext: Knex
) {
	const expiration = Math.round(
		addSeconds(new Date(), configuration.Security.accessTokenExpirationSeconds || 3600).getTime() / 1000
	)

	if (!userClient) {
		const result = {
			sub: `${client.client_id}@clients`,
			aud: client.client_id,
			iss: configuration.Server.baseUrl!,
			exp: expiration,
			at_hash: undefined
		}
		return signTokenForClient(result, client, dataContext)
	} else if (userClient.allowedScopes && userClient.allowedScopes.length > 0) {
		const allowedScopes = JSON.parse(userClient.allowedScopes)
		const result: IAccessToken = {
			sub: userClient.userClientId,
			scopes: allowedScopes,
			exp: expiration
		}
		if (refreshToken) {
			result.id = refreshToken.id
		}

		return signTokenForClient(result, client, dataContext)
	} else {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'User has not authorized client')
	}
}
