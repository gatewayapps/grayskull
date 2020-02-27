import { DataContext } from '../../../foundation/context/getDataContext'
import { getCacheKeyForPhoneNumberVerification } from '../../logic/getCacheKeyForPhoneNumberVerification'
import { getValue } from '../persistentCache/getValue'

export async function verifyPhoneNumberVerificationCode(
	phoneNumber: string,
	verificationCode: string,
	dataContext: DataContext
) {
	const CACHE_KEY = getCacheKeyForPhoneNumberVerification(phoneNumber)
	const cachedValue = await getValue(CACHE_KEY, dataContext)
	return cachedValue === verificationCode
}
