import { DataContext } from '../../../foundation/context/getDataContext'
import { randomBytes } from 'crypto'
import { cacheValue } from '../persistentCache/cacheValue'
import { getCacheKeyForEmailVerification } from '../../logic/getCacheKeyForEmailVerification'

export async function generateEmailAddressVerificationCode(
	emailAddress: string,
	expirationSeconds: number,
	dataContext: DataContext
) {
	const verificationCode = randomBytes(32).toString('hex')
	const CACHE_KEY = getCacheKeyForEmailVerification(emailAddress)
	await cacheValue(CACHE_KEY, verificationCode, expirationSeconds, dataContext)

	return verificationCode
}
