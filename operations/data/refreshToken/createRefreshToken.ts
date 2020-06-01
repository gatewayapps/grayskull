import Knex from 'knex'
import { randomBytes, createHmac } from 'crypto'
import { addSeconds } from 'date-fns'
import { IRefreshToken } from '../../../foundation/types/types'
import { v4 as uuidv4 } from 'uuid'

export async function createRefreshToken(
	clientSecret: string,
	userClientId: string,
	ttlSeconds: number | undefined,
	dataContext: Knex
): Promise<IRefreshToken> {
	const tokenData = randomBytes(64).toString('hex')
	const hashedToken = createHmac('sha256', clientSecret)
		.update(tokenData)
		.digest('hex')

	const expiresAt = ttlSeconds && ttlSeconds > 0 ? addSeconds(new Date(), ttlSeconds) : null

	const rt: Partial<IRefreshToken> = {
		activeAt: new Date(),
		expiresAt,
		id: uuidv4(),
		token: hashedToken,
		issuedAt: new Date(),
		userClientId
	}

	await dataContext<IRefreshToken>('RefreshTokens').insert(rt)
	const result = await dataContext<IRefreshToken>('RefreshTokens')
		.where({ id: rt.id })
		.select('*')
		.first()
	if (result) {
		result.token = tokenData
		return result
	} else {
		throw new Error('Failed to insert refresh token in database')
	}
}
