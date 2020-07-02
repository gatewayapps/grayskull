import { IChallengeToken } from '../../foundation/types/tokens'
import { signTokenForClient } from './signTokenForClient'
import Knex from 'knex'
import { IClient } from '../../foundation/types/types'

export async function createChallengeToken(
	emailAddress: string,
	userClientId: string,
	scopes: string[],
	client: IClient,
	dataContext: Knex
) {
	const challengeToken: IChallengeToken = {
		emailAddress,
		userClientId,
		scopes,
		iat: new Date().getTime()
	}

	return signTokenForClient(challengeToken, client, dataContext)
}
