import { DataContext } from '../../../foundation/context/getDataContext'

import { getRefreshTokenFromRawToken } from './getRefreshTokenFromRawToken'
import { IClient } from '../../../foundation/types/types'

export async function updateRefreshTokenActiveAt(refreshToken: string, client: IClient, dataContext: DataContext) {
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
  await dataContext.RefreshToken.update({ activeAt: new Date() }, { where: { id: token.id }, validate: false })
}
