import { IRequestContext } from '../../../foundation/context/prepareContext'
import twilio from 'twilio'

export async function sendMessageToPhoneNumber(phoneNumber: string, message: string, context: IRequestContext) {
	const client = twilio(context.configuration.Security.twilioSID!, context.configuration.Security.twilioApiKey!)
	await client.messages.create({ to: phoneNumber, body: message, from: context.configuration.Security.smsFromNumber! })
}
