import { CacheContext } from '../../../foundation/context/getCacheContext'
import { IEmailAddress } from '../../../foundation/types/types'
import Knex from 'knex'
export async function getPrimaryEmailAddress(
	userAccountId: string,
	dataContext: Knex,
	cacheContext: CacheContext
): Promise<IEmailAddress | undefined> {
	const cacheKey = `PRIMARY_EMAIL_${userAccountId}`
	const cachedEmail = cacheContext.getValue<IEmailAddress>(cacheKey)
	if (cachedEmail) {
		return cachedEmail
	} else {
		const primaryEmailRecord = await dataContext<IEmailAddress>('EmailAddresses')
			.where({ userAccountId, primary: true })
			.select('*')
			.first()
		if (primaryEmailRecord) {
			cacheContext.setValue(cacheKey, primaryEmailRecord, 30)
		}
		return primaryEmailRecord
	}
}
