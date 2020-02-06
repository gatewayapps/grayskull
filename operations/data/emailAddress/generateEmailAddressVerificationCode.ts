import { DataContext } from '../../../foundation/context/getDataContext'
import { randomBytes } from 'crypto'
import { cacheValue } from '../persistentCache/cacheValue'

export async function generateEmailAddressVerificationCode(
  emailAddress: string,
  expirationSeconds: number,
  dataContext: DataContext
) {
  const verificationCode = randomBytes(32).toString('hex')
  await cacheValue(`VERIFICATION:${emailAddress}`, verificationCode, expirationSeconds, dataContext)

  return verificationCode
}
