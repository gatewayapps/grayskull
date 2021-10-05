import { IClient } from '../../foundation/types/types'
import Knex from 'knex'
import jwt from 'jsonwebtoken'
import { getRSAPublicKey } from '../data/configuration/getRSAPublicKey'

export async function verifyTokenForClient(token: string, client: IClient, dataContext: Knex) {
	if (client.TokenSigningMethod === 'HS256') {
		return jwt.verify(token, client.secret!)
	} else if (client.TokenSigningMethod === 'RS256') {
		const publicKey = await getRSAPublicKey(dataContext)
		if (publicKey) {
			return jwt.verify(token, publicKey)
		}
	}
	return false
}
