import { IRequestContext } from '../foundation/context/prepareContext'
import { getValue } from '../operations/data/persistentCache/getValue'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { setEmailAddressVerified } from '../operations/data/emailAddress/setEmailAddressVerified'

export async function verifyEmailAddress(emailAddress: string, verificationCode: string, context: IRequestContext) {
  const cachedRecord = await getValue(`VERIFICATION:${emailAddress}`, context.dataContext)
  if (cachedRecord !== verificationCode) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailVerificationCode,
      `Failed to verify email address ${emailAddress} with ${verificationCode}`
    )
  } else {
    await setEmailAddressVerified(emailAddress, context.dataContext)
  }
}
