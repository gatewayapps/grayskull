import { IRequestContext } from '../foundation/context/prepareContext'

import { getEmailAddressByEmailAddress } from '../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { Permissions } from '../foundation/constants/permissions'
import { generateEmailAddressVerificationCode } from '../operations/data/emailAddress/generateEmailAddressVerificationCode'
import { sendTemplatedEmail } from '../operations/services/mail/sendEmailTemplate'

const INVITATION_EXPIRES_IN = 60 * 60 // 1 hour

export async function sendEmailVerificationActivity(
  emailAddress: string,
  { dataContext, configuration, user }: IRequestContext
) {
  const emailRecord = await getEmailAddressByEmailAddress(emailAddress, dataContext)
  if (!emailRecord) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `Attempted to send verification email to ${emailAddress} which is not registered`
    )
  }

  if (emailRecord.verified) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `Attempted to send verification email to ${emailAddress} which is already verified`
    )
  }

  if (user && emailRecord.userAccountId !== user.userAccountId && user.permissions !== Permissions.Admin) {
    throw new GrayskullError(
      GrayskullErrorCode.InvalidEmailAddress,
      `User ${user?.userAccountId} attempted to send verification email to ${emailAddress} which does not belong to them.`
    )
  }

  const verificationCode = await generateEmailAddressVerificationCode(emailAddress, INVITATION_EXPIRES_IN, dataContext)

  await sendTemplatedEmail(
    `verifyEmailTemplate`,
    emailAddress,
    'E-mail Address Verification',
    {
      realmName: configuration.Server.realmName,
      user,
      verificationLink: `${configuration.Server.baseUrl}/verify?address=${encodeURIComponent(
        emailAddress
      )}&code=${verificationCode}`
    },
    configuration
  )
}
