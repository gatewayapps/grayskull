import { IRequestContext } from '../foundation/context/prepareContext'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { getEmailAddressesForUserAccountId } from '../operations/data/emailAddress/getEmailAddressesForUserAccountId'
import { GrayskullErrorCode, GrayskullError } from '../foundation/errors/GrayskullError'
import { getPrimaryPhoneNumberForUserAccount } from '../operations/data/phoneNumber/getPrimaryPhoneNumberForUserAccount'
import { maskEmailAddress } from '../operations/logic/maskEmailAddress'
import { maskPhoneNumber } from '../operations/logic/maskPhoneNumber'

/* We should return the following
  [
    {
      type: 'sms' | 'email',
      id: phoneNumberId | emailAddressId,
      value: sanitized phoneNumber | emailAddress
    }
  ]
*/

export interface IOTPOptions {
	type: 'sms' | 'email'
	id: string
	value: string
}

export async function getOTPBackupOptionsForEmailAddressActivity(emailAddress: string, context: IRequestContext) {
	const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, undefined, false)
	if (!userAccount) {
		throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `No user found for ${emailAddress}`)
	}
	const emailAddresses = await getEmailAddressesForUserAccountId(userAccount.userAccountId, context.dataContext, true)
	const phoneNumber = await getPrimaryPhoneNumberForUserAccount(userAccount.userAccountId, context.dataContext)

	const result: IOTPOptions[] = []
	emailAddresses.forEach((e) => {
		result.push({
			type: 'email',
			id: e.emailAddressId,
			value: maskEmailAddress(e.emailAddress)
		})
	})
	if (phoneNumber) {
		result.push({
			type: 'sms',
			id: phoneNumber.phoneNumberId,
			value: maskPhoneNumber(phoneNumber.phoneNumber)
		})
	}
	return result
}
