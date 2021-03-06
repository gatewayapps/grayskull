import { randomBytes } from 'crypto'
import { cacheValue } from '../persistentCache/cacheValue'
import { UserContext } from '../../../foundation/context/getUserContext'
import Knex from 'knex'

export async function generateAuthorizationCode(
	clientId: string,
	scope: string[],
	userClientId: string,
	nonce: string,
	userAccount: UserContext,
	dataContext: Knex
) {
	const authorizationCode = randomBytes(64).toString('hex')
	await cacheValue(
		authorizationCode,
		JSON.stringify({ clientId, scope, userAccount, userClientId, nonce }),
		120,
		dataContext
	)

	return authorizationCode
}
