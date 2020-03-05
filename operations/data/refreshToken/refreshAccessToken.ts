import Knex from 'knex'

import { getRefreshTokenFromRawToken } from './getRefreshTokenFromRawToken'
import { IClient, IRefreshToken } from '../../../foundation/types/types'

export async function updateRefreshTokenActiveAt(refreshToken: string, client: IClient, dataContext: Knex) {
	const token = await getRefreshTokenFromRawToken(refreshToken, client, dataContext)
	if (!token) {
		throw new ReferenceError('Refresh token does not exist')
	}
	if (token.deletedAt) {
		throw new Error('Refresh token has been deleted')
	}
	if (token.revokedAt) {
		throw new Error('Refresh token has been revoked')
	}

	token.activeAt = new Date()
	await dataContext<IRefreshToken>('RefreshTokens')
		.where({ id: token.id })
		.update({ activeAt: new Date() })
}
