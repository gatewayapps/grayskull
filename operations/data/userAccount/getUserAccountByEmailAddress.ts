import { CacheContext } from '../../../foundation/context/getCacheContext'
import { DataContext } from '../../../foundation/context/getDataContext'
import { getEmailAddressByEmailAddress } from '../emailAddress/getEmailAddressByEmailAddress'
import { getUserAccount } from './getUserAccount'

export async function getUserAccountByEmailAddress(
  emailAddress: string,
  dataContext: DataContext,
  cacheContext: CacheContext,
  includeSensitive = false
) {
  const emailAddressRecord = await getEmailAddressByEmailAddress(emailAddress, dataContext)
  if (emailAddressRecord) {
    return await getUserAccount(emailAddressRecord.userAccountId, dataContext, cacheContext, includeSensitive)
  }

  return null
}
