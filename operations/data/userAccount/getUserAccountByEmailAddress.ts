import { CacheContext } from '../../../foundation/context/getCacheContext'

import { getEmailAddressByEmailAddress } from '../emailAddress/getEmailAddressByEmailAddress'
import { getUserAccount } from './getUserAccount'
import { GrayskullErrorCode, GrayskullError } from '../../../foundation/errors/GrayskullError'
import Knex from 'knex'

export async function getUserAccountByEmailAddress(
	emailAddress: string,
	dataContext: Knex,
	cacheContext?: CacheContext,
	includeSensitive = false
) {
	const emailAddressRecord = await getEmailAddressByEmailAddress(emailAddress, dataContext)
	if (emailAddressRecord) {
		const userAccount = await getUserAccount(
			emailAddressRecord.userAccountId,
			dataContext,
			cacheContext,
			includeSensitive
		)
		if (!userAccount) {
			throw new GrayskullError(
				GrayskullErrorCode.InvalidUserAccountId,
				`No user account exists with id ${emailAddressRecord.userAccountId}`
			)
		} else {
			return userAccount
		}
	}

	return null
}
