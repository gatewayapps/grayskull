import { getUserProfileForClient } from './getUserProfileForClient'
import { UserContext } from '../../foundation/context/getUserContext'

import { IConfiguration, IClient, IUserClient } from '../../foundation/types/types'

import { createHmac } from 'crypto'
import jwt from 'jsonwebtoken'
import { IIDToken, IProfileClaim, IEmailClaim, IMetaClaim } from '../../foundation/types/tokens'
import { addSeconds } from 'date-fns'
import Knex from 'knex'
import { getRSAPrivateKey } from '../data/configuration/getRSAPrivateKey'
import { generateRSAKeyPair } from '../data/configuration/generateRSAKeyPair'
import { getRSAKeyId } from '../data/configuration/getRSAKeyId'

export async function createIDToken(
	userContext: UserContext,
	client: IClient,
	userClient: IUserClient,
	nonce: string | undefined,
	accessToken: string | undefined,

	configuration: IConfiguration,
	dataContext: Knex
): Promise<string> {
	const security = configuration.Security!
	const serverConfig = configuration.Server!

	const expiration = Math.round(addSeconds(new Date(), security.accessTokenExpirationSeconds || 300).getTime() / 1000)
	const profile = await getUserProfileForClient(userContext, userClient, dataContext)
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

	const result: IIDToken & IProfileClaim & IEmailClaim & IMetaClaim = Object.assign(tokenBase, profile)

	if (client.TokenSigningMethod === 'RS256') {
		let rsaPrivateKey = await getRSAPrivateKey(dataContext)

		if (!rsaPrivateKey) {
			const result = await generateRSAKeyPair(dataContext)
			rsaPrivateKey = result.privateKey
		}
		if (!rsaPrivateKey) {
			throw new Error('Unable to obtain RSA Private Key')
		}
		const rsaKeyId = await getRSAKeyId(dataContext)
		return jwt.sign(result, rsaPrivateKey, {
			algorithm: client.TokenSigningMethod as 'HS256' | 'RS256',
			keyid: rsaKeyId
		})
	} else {
		return jwt.sign(result, client.secret, {
			algorithm: client.TokenSigningMethod as 'HS256' | 'RS256'
		})
	}
}
