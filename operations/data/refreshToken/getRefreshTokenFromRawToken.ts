import { hashValue } from '../../logic/hashValue'
import { IClient, IRefreshToken } from '../../../foundation/types/types'
import Knex from 'knex'

export async function getRefreshTokenFromRawToken(refreshToken: string, client: IClient, dataContext: Knex) {
	const hashedToken = hashValue(refreshToken, client.secret)
	const tokenRecord = await dataContext<IRefreshToken>('RefreshTokens')
		.where({ token: hashedToken })
		.select('*')
		.first()

	if (tokenRecord) {
		tokenRecord.token = refreshToken
	}
	return tokenRecord
}
