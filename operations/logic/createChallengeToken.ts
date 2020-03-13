import jwt from 'jsonwebtoken'
import { IChallengeToken } from '../../foundation/types/tokens'

export async function createChallengeToken(userClientId: string, scopes: string[], clientSecret: string) {
	const challengeToken: IChallengeToken = {
		userClientId,
		scopes,
		iat: new Date()
	}

	return jwt.sign(challengeToken, clientSecret)
}
