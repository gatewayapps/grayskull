import { IUserClient, IConfiguration, IClient, IRefreshToken } from '../../foundation/types/types'

import { addSeconds } from 'date-fns'

import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import jwt from 'jsonwebtoken'
import { IAccessToken } from '../../foundation/types/tokens'

export async function createAccessToken(
	client: IClient,
	userClient: IUserClient,
	refreshToken: IRefreshToken | undefined,
	configuration: IConfiguration
) {
	if (userClient.allowedScopes && userClient.allowedScopes.length > 0) {
		const allowedScopes = JSON.parse(userClient.allowedScopes)
		const result: IAccessToken = {
			sub: userClient.userClientId,
			scopes: allowedScopes,
			exp: addSeconds(new Date(), configuration.Security.accessTokenExpirationSeconds || 300).getTime()
		}
		if (refreshToken) {
			result.id = refreshToken.id
		}

		return jwt.sign(result, client.secret)
	} else {
		throw new GrayskullError(GrayskullErrorCode.NotAuthorized, 'User has not authorized client')
	}
}
