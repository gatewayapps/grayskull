import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext } from '../../../foundation/context/getCacheContext'
import { IEmailAddress } from '../../../foundation/types/types'

export async function getPrimaryEmailAddress(
	userAccountId: string,
	dataContext: DataContext,
	cacheContext: CacheContext
): Promise<IEmailAddress | undefined> {
	const cacheKey = `PRIMARY_EMAIL_${userAccountId}`
	const cachedEmail = cacheContext.getValue<IEmailAddress>(cacheKey)
	if (cachedEmail) {
		return cachedEmail
	} else {
		const primaryEmailRecord = await dataContext.EmailAddress.where({ userAccountId, primary: true })
			.select('*')
			.first()
		if (primaryEmailRecord) {
			cacheContext.setValue(cacheKey, primaryEmailRecord, 30)
		}
		return primaryEmailRecord
	}
}
