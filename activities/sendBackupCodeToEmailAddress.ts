import { IRequestContext } from "../foundation/context/prepareContext"
import { getUserAccountByEmailAddress } from "../operations/data/userAccount/getUserAccountByEmailAddress"
import { GrayskullError, GrayskullErrorCode } from "../foundation/errors/GrayskullError"
import { decrypt } from "../operations/logic/encryption"
import * as otplib from 'otplib'
import { generateBackupMultifactorCode } from "../operations/data/userAccount/generateBackupMultifactorCode"
import MailService from "../server/api/services/MailService"

export async function sendBackupCodeToEmailAddress(
  emailAddress: string,
  context: IRequestContext
) {

  const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext, true)
  if (!userAccount || !userAccount.otpEnabled || !userAccount.otpSecret) {
    throw new GrayskullError(GrayskullErrorCode.InvalidEmailAddress, `No MFA keys found associated with email address ${emailAddress}`)
  }

  const otpSecret = decrypt(userAccount.otpSecret)
  if (!otpSecret) {
    throw new GrayskullError(GrayskullErrorCode.InvalidOTP, `Failed to decrypt the OTP secret`)
  }

  const backupCode = await generateBackupMultifactorCode(emailAddress, otpSecret, context.dataContext)


  await MailService.sendEmailTemplate(
    'backupCodeTemplate',
    emailAddress,
    `${context.configuration.Server.realmName} Backup Code`,
    {
      realmName: context.configuration.Server.realmName,
      userAccount,
      backupCode
    },
    context.configuration
  )
}
