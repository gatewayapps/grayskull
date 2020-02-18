import { DataContext } from '../../../foundation/context/getDataContext'
import { getValue } from '../persistentCache/getValue'
import { getCacheKeyForEmailVerification } from '../../logic/getCacheKeyForEmailVerification'

export async function verifyEmailAddressVerificationCode(emailAddress: string, code: string, dataContext: DataContext) {
  const CACHE_KEY = getCacheKeyForEmailVerification(emailAddress)
  const cachedRecord = await getValue(CACHE_KEY, dataContext)

  return cachedRecord === code
}
