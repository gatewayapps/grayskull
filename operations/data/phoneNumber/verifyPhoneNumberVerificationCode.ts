import { getCacheKeyForPhoneNumberVerification } from '../../logic/getCacheKeyForPhoneNumberVerification'
import { getValue } from '../persistentCache/getValue'
import Knex from 'knex'

export async function verifyPhoneNumberVerificationCode(
	phoneNumber: string,
	verificationCode: string,
	dataContext: Knex
) {
	const CACHE_KEY = getCacheKeyForPhoneNumberVerification(phoneNumber)
	const cachedValue = await getValue(CACHE_KEY, dataContext)
	return cachedValue === verificationCode
}
