import { IRequestContext } from '../foundation/context/prepareContext'

import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { setEmailAddressVerified } from '../operations/data/emailAddress/setEmailAddressVerified'
import { verifyEmailAddressVerificationCode } from '../operations/data/emailAddress/verifyEmailAddressVerificationCode'
import { clearValue } from '../operations/data/persistentCache/clearValue'
import { getCacheKeyForEmailVerification } from '../operations/logic/getCacheKeyForEmailVerification'
import { getEmailAddressByEmailAddress } from '../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { setUserAccountActive } from '../operations/data/userAccount/setUserAccountActive'

import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'

export async function verifyEmailAddressActivity(
  emailAddress: string,
  verificationCode: string,
  context: IRequestContext
) {
  const emailAddressRecord = await getEmailAddressByEmailAddress(emailAddress, context.dataContext)
  if (!emailAddressRecord) {
    throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `${emailAddress} is not a valid email address`)
  }

  if (context.user && emailAddressRecord.userAccountId !== context.user.userAccountId) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `${emailAddress} is not registered for your account`
    )
  }

  if (await verifyEmailAddressVerificationCode(emailAddress, verificationCode, context.dataContext)) {
    await setEmailAddressVerified(emailAddress, context.dataContext)
    const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, undefined, false)
    if (!userAccount) {
      throw new GrayskullError(
        GrayskullErrorCode.InvalidEmailAddress,
        `No user account exists for email address ${emailAddress}`
      )
    }
    await setUserAccountActive(userAccount.userAccountId, true, context.dataContext)

    const CACHE_KEY = getCacheKeyForEmailVerification(emailAddress)
    await clearValue(CACHE_KEY, context.dataContext)
  } else {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailVerificationCode,
      `Failed to verify email address ${emailAddress} with ${verificationCode}`
    )
  }
}
