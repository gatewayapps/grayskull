import Knex from 'knex'
import { randomBytes } from 'crypto'
import { cacheValue } from '../persistentCache/cacheValue'
import { getCacheKeyForUserAccountActivation } from '../../logic/getCacheKeyForUserAccountActivation'

export async function generateUserAccountActivationToken(emailAddress: string, dataContext: Knex) {
	const token = randomBytes(16).toString('hex')
	const CACHE_KEY = getCacheKeyForUserAccountActivation(emailAddress)
	await cacheValue(CACHE_KEY, token, 3600, dataContext)
	return token
}
