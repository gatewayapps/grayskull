import { IRequestContext } from '../../foundation/context/prepareContext'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { setEmailAddressVerified } from '../../operations/data/emailAddress/setEmailAddressVerified'
import { getEmailAddressByEmailAddress } from '../../operations/data/emailAddress/getEmailAddressByEmailAddress'

export async function manualUserEmailVerificationActivity(emailAddress: string, context: IRequestContext) {
	const emailAddressRecord = await getEmailAddressByEmailAddress(emailAddress, context.dataContext)
	if (!emailAddressRecord) {
		throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `${emailAddress} is not a valid email address`)
	}

	await setEmailAddressVerified(emailAddress, context.dataContext)
}
