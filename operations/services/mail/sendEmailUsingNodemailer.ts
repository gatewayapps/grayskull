import nodemailer, { SendMailOptions } from 'nodemailer'

import { IMailConfiguration } from '../../../foundation/types/types'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function sendEmailUsingNodemailer(
	to: string,
	subject: string,
	text: string,
	html: string,
	config: IMailConfiguration
) {
	if (!config.serverAddress) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidConfiguration,
			`You must have a server address configured to use sendEmailUsingNodemailer`
		)
	}
	if (!config.fromAddress) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidConfiguration,
			`You must have a from address configured to use sendEmailUsingSendgrid`
		)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const options: any = {
		host: config.serverAddress,
		port: config.port,
		secure: config.tlsSslRequired,
		auth: config.username ?? {
			user: config.username,
			pass: config.password
		}
	}

	const transport = nodemailer.createTransport(options)

	const messageOptions: SendMailOptions = {
		from: config.fromAddress,
		to,
		subject,
		text,
		html
	}

	await transport.sendMail(messageOptions)
}
