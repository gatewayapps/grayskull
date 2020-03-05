import { getValue } from '../persistentCache/getValue'
import { getCacheKeyForEmailVerification } from '../../logic/getCacheKeyForEmailVerification'
import Knex from 'knex'

export async function verifyEmailAddressVerificationCode(emailAddress: string, code: string, dataContext: Knex) {
	const CACHE_KEY = getCacheKeyForEmailVerification(emailAddress)
	const cachedRecord = await getValue(CACHE_KEY, dataContext)

	return cachedRecord === code
}
