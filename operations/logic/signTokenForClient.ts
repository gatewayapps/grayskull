import { IClient } from '../../foundation/types/types'
import { getRSAPrivateKey } from '../data/configuration/getRSAPrivateKey'
import { generateRSAKeyPair } from '../data/configuration/generateRSAKeyPair'
import { getRSAKeyId } from '../data/configuration/getRSAKeyId'
import jwt from 'jsonwebtoken'

import Knex from 'knex'

export async function signTokenForClient(token: string | object | Buffer, client: IClient, dataContext: Knex) {
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
		return jwt.sign(token, rsaPrivateKey, {
			algorithm: client.TokenSigningMethod as 'HS256' | 'RS256',
			keyid: rsaKeyId
		})
	} else {
		return jwt.sign(token, client.secret!, {
			algorithm: client.TokenSigningMethod as 'HS256' | 'RS256'
		})
	}
}
