import { getUserProfileForClient } from './getUserProfileForClient'
import { UserContext } from '../../foundation/context/getUserContext'

import { IConfiguration, IClient, IUserClient } from '../../foundation/types/types'

import { createHmac } from 'crypto'
import jwt from 'jsonwebtoken'
import { IIDToken, IProfileClaim, IEmailClaim } from '../../foundation/types/tokens'
import { addSeconds } from 'date-fns'

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

	const expiration = Math.round(addSeconds(new Date(), security.accessTokenExpirationSeconds || 300).getTime() / 1000)
	const profile = getUserProfileForClient(userContext, userClient)
	let at_hash: string | undefined = undefined
	if (accessToken) {
		const hmac = createHmac('sha256', client.secret)
		const digest = hmac.update(accessToken).digest()

		const finalBytes = digest.slice(0, 15)
		at_hash = finalBytes.toString('base64')
	}

	const tokenBase: any = {
		exp: expiration,
		aud: client.client_id,
		sub: profile.sub,
		at_hash: at_hash,
		iss: serverConfig.baseUrl!,
		nonce: nonce
	}

	const result: IIDToken & IProfileClaim & IEmailClaim = Object.assign(tokenBase, profile)

	return jwt.sign(result, client.secret)
}
