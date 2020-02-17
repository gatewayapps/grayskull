import { DataContext } from '../../../foundation/context/getDataContext'
import { randomBytes, createHmac } from 'crypto'
import { addSeconds } from 'date-fns'
import { IRefreshToken } from '../../../foundation/types/types'

export async function createRefreshToken(
  clientSecret: string,
  userClientId: string,
  ttlSeconds: number | undefined,
  dataContext: DataContext
): Promise<IRefreshToken> {
  const tokenData = randomBytes(64).toString('hex')
  const hashedToken = createHmac('sha256', clientSecret)
    .update(tokenData)
    .digest('hex')

  const expiresAt = ttlSeconds && ttlSeconds > 0 ? addSeconds(new Date(), ttlSeconds) : null

  const result = await dataContext.RefreshToken.create({
    token: hashedToken,
    expiresAt,
    userClientId
  })

  result.token = tokenData
  return result
}
