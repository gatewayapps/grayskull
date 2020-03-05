import { getUserProfileForClient } from './getUserProfileForClient'
import { UserContext } from '../../foundation/context/getUserContext'

import { IConfiguration, IClient, IUserClient } from '../../foundation/types/types'

import moment from 'moment'

import { createHmac } from 'crypto'
import jwt from 'jsonwebtoken'
import { IIDToken, IProfileClaim, IEmailClaim } from '../../foundation/types/tokens'

export async function createIDToken(
	userContext: UserContext,
	client: IClient,
	userClient: IUserClient,
	nonce: string | undefined,
	accessToken: string | undefined,

	configuration: IConfiguration
): Promise<string> {
	const security = configuration.Security!
	const serverConfig = configuration.Server!

	const profile = getUserProfileForClient(userContext, userClient)
	let at_hash: string | undefined = undefined
	if (accessToken) {
		const hmac = createHmac('sha256', client.secret)
		const digest = hmac.update(accessToken).digest()

		const finalBytes = digest.slice(0, 15)
		at_hash = finalBytes.toString('base64')
	}

	const tokenBase: IIDToken = {
		iat: moment().unix(),
		exp: moment()
			.add(security.accessTokenExpirationSeconds || 300, 'seconds')
			.unix(),
		aud: client.client_id,
		sub: profile.sub,
		at_hash: at_hash,
		iss: serverConfig.baseUrl!,
		nonce: nonce
	}

	const result: IIDToken & IProfileClaim & IEmailClaim = Object.assign(tokenBase, profile)

	return jwt.sign(result, client.secret)
}
