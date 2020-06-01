import jwt from 'jsonwebtoken'
import { IChallengeToken } from '../../foundation/types/tokens'

export async function createChallengeToken(
	emailAddress: string,
	userClientId: string,
	scopes: string[],
	clientSecret: string
) {
	const challengeToken: IChallengeToken = {
		emailAddress,
		userClientId,
		scopes,
		iat: new Date().getTime()
	}

	return jwt.sign(challengeToken, clientSecret)
}
