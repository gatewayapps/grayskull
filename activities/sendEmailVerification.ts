import { IRequestContext } from '../foundation/context/prepareContext'
import { randomBytes } from 'crypto'
import { cacheValue } from '../operations/data/persistentCache/cacheValue'
import MailService from '../server/api/services/MailService'
import { getEmailAddressByEmailAddress } from '../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { Permissions } from '../foundation/constants/permissions'

const INVITATION_EXPIRES_IN = 60 * 60 // 1 hour

export async function sendEmailVerification(
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

  const verificationCode = randomBytes(32).toString('hex')
  await cacheValue(`VERIFICATION:${emailAddress}`, verificationCode, INVITATION_EXPIRES_IN, dataContext)

  await MailService.sendEmailTemplate(
    `verifyEmailTemplate`,
    emailAddress,
    'E-mail Address Verification',
    {
      realmName: configuration.Server.realmName,
      user,
      verificationLink: `${configuration.Server.baseUrl}/verify?address=${emailAddress}&code=${verificationCode}`
    },
    configuration
  )
}
