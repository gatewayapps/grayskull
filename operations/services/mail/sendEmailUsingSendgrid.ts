import sgMail from '@sendgrid/mail'
import { IMailConfiguration } from '../../../foundation/types/types'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import { delay } from 'bluebird'

export async function sendEmailUsingSendgrid(
	to: string,
	subject: string,
	text: string,
	html: string,
	config: IMailConfiguration
) {
	if (!config.sendgridApiKey) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidConfiguration,
			`You must have a sendgrid api key configured to use sendEmailUsingSendgrid`
		)
	}
	if (!config.fromAddress) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidConfiguration,
			`You must have a from address configured to use sendEmailUsingSendgrid`
		)
	}
	sgMail.setApiKey(config.sendgridApiKey)

	const msg = {
		from: config.fromAddress.toString(),
		to,
		subject,
		text,
		html
	}
	let attemptCount = 0
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let result: any
	do {
		result = await sgMail.send(msg)
		if (result[0].statusCode !== 202) {
			await delay(1000)
		}
	} while (result[0].statusCode !== 202 && attemptCount++ < 3)

	return
}
