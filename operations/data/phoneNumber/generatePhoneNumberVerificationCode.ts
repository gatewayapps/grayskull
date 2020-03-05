import { cacheValue } from '../persistentCache/cacheValue'
import { getCacheKeyForPhoneNumberVerification } from '../../logic/getCacheKeyForPhoneNumberVerification'
import Knex from 'knex'

function getRandomArbitrary(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

export async function generatePhoneNumberVerificationCode(
	phoneNumber: string,
	expirationSeconds: number,
	dataContext: Knex
) {
	const verificationCode = getRandomArbitrary(100000, 999999).toString()
	const CACHE_KEY = getCacheKeyForPhoneNumberVerification(phoneNumber)
	await cacheValue(CACHE_KEY, verificationCode, expirationSeconds, dataContext)

	return verificationCode
}
