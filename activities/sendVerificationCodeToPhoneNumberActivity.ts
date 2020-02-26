import { IRequestContext } from '../foundation/context/prepareContext'
import { ensureAuthenticated } from '../operations/logic/ensureAuthenticated'
import { generatePhoneNumberVerificationCode } from '../operations/data/phoneNumber/generatePhoneNumberVerificationCode'
import { sendMessageToPhoneNumber } from '../operations/services/sms/sendMessageToPhoneNumber'

export async function sendVerificationCodeToPhoneNumberActivity(phoneNumber: string, context: IRequestContext) {
	ensureAuthenticated(context)
	const code = await generatePhoneNumberVerificationCode(phoneNumber, 300, context.dataContext)
	await sendMessageToPhoneNumber(
		phoneNumber,
		`${context.configuration.Server.realmName} verification code: ${code}`,
		context
	)
}
