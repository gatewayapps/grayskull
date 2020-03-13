import { IRequestContext } from '../../foundation/context/prepareContext'
import { getUserAccountByEmailAddress } from '../../operations/data/userAccount/getUserAccountByEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../../foundation/errors/GrayskullError'
import { decrypt } from '../../operations/logic/encryption'

import { generateBackupMultifactorCode } from '../../operations/data/userAccount/generateBackupMultifactorCode'

import { sendTemplatedEmail } from '../../operations/services/mail/sendEmailTemplate'
import { getEmailAddressById } from '../../operations/data/emailAddress/getEmailAddressById'
import { getPhoneNumberById } from '../../operations/data/phoneNumber/getPhoneNumberById'
import { sendMessageToPhoneNumber } from '../../operations/services/sms/sendMessageToPhoneNumber'

export async function sendOTPActivity(emailAddress: string, type: string, id: string, context: IRequestContext) {
	const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, context.cacheContext, true)
	if (!userAccount || !userAccount.otpEnabled || !userAccount.otpSecret) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailAddress,
			`No MFA keys found associated with email address ${emailAddress}`
		)
	}

	const otpSecret = decrypt(userAccount.otpSecret)
	if (!otpSecret) {
		throw new GrayskullError(GrayskullErrorCode.InvalidOTP, `Failed to decrypt the OTP secret`)
	}

	const backupCode = await generateBackupMultifactorCode(emailAddress, otpSecret, context.dataContext)
	if (type === 'email') {
		const email = await getEmailAddressById(id, context.dataContext)
		if (email) {
			await sendTemplatedEmail(
				'backupCodeTemplate',
				email.emailAddress,
				`${context.configuration.Server.realmName} Backup Code`,
				{
					realmName: context.configuration.Server.realmName,
					userAccount,
					backupCode
				},
				context.configuration
			)
		}
	}
	if (type === 'sms') {
		const phoneNumber = await getPhoneNumberById(id, context.dataContext)
		if (phoneNumber) {
			await sendMessageToPhoneNumber(
				phoneNumber.phoneNumber,
				`${context.configuration.Server.realmName} verification code: ${backupCode}`,
				context
			)
		}
	}
}
