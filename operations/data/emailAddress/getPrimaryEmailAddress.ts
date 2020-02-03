import { DataContext } from '../../../foundation/context/getDataContext'
import { CacheContext } from '../../../foundation/context/getCacheContext'
import { EmailAddress } from '../../../foundation/models/EmailAddress'

export async function getPrimaryEmailAddress(
  userAccountId: string,
  dataContext: DataContext,
  cacheContext: CacheContext
): Promise<EmailAddress | null> {
  const cacheKey = `PRIMARY_EMAIL_${userAccountId}`
  const cachedEmail = cacheContext.getValue<EmailAddress>(cacheKey)
  if (cachedEmail) {
    return cachedEmail
  } else {
    const primaryEmailRecord = await dataContext.EmailAddress.findOne({ where: { userAccountId, primary: true } })
    if (primaryEmailRecord) {
      cacheContext.setValue(cacheKey, primaryEmailRecord, 30)
    }
    return primaryEmailRecord
  }
}
