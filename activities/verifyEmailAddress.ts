import { IRequestContext } from '../foundation/context/prepareContext'

import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { setEmailAddressVerified } from '../operations/data/emailAddress/setEmailAddressVerified'
import { verifyEmailAddressVerificationCode } from '../operations/data/emailAddress/verifyEmailAddressVerificationCode'
import { clearValue } from '../operations/data/persistentCache/clearValue'

export async function verifyEmailAddress(emailAddress: string, verificationCode: string, context: IRequestContext) {
  if (await verifyEmailAddressVerificationCode(emailAddress, verificationCode, context.dataContext)) {
    await setEmailAddressVerified(emailAddress, context.dataContext)
    await clearValue(`BACKUP_MFA:${emailAddress}`, context.dataContext)
  } else {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailVerificationCode,
      `Failed to verify email address ${emailAddress} with ${verificationCode}`
    )
  }
}
