import jwt from 'jsonwebtoken'
import { IChallengeToken } from '../../foundation/types/tokens'
export async function verifyChallengeToken(challengeToken: string, clientSecret: string) {
	return (await jwt.verify(challengeToken, clientSecret)) as IChallengeToken | undefined
}
