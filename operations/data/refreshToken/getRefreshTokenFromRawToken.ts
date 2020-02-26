import { hashValue } from '../../logic/hashValue'
import { IClient } from '../../../foundation/types/types'
import { DataContext } from '../../../foundation/context/getDataContext'

export async function getRefreshTokenFromRawToken(refreshToken: string, client: IClient, context: DataContext) {
	const hashedToken = hashValue(refreshToken, client.secret)
	const tokenRecord = await context.RefreshToken.findOne({ where: { token: hashedToken } })
	if (tokenRecord) {
		tokenRecord.token = refreshToken
	}
	return tokenRecord
}
