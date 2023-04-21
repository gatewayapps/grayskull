import { IMailConfiguration } from '../../../foundation/types/types'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import { ServerClient } from 'postmark'

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

	const client = new ServerClient(process.env.POSTMARK_API_KEY!)
	client.sendEmail({
		From: config.fromAddress,
		Subject: subject,
		To: to,
		HtmlBody: html,
		TextBody: text,
		MessageStream: 'outbound'
	})
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// const options: any = {
	// 	host: config.serverAddress,
	// 	port: config.port,
	// 	secure: config.tlsSslRequired,
	// 	auth: config.username ?? {
	// 		user: config.username,
	// 		pass: config.password
	// 	}
	// }

	// console.warn(JSON.stringify({ ...options, auth: { user: config.username, more: config.password } }))

	// // if (process.env.NODE_ENV !== 'production') {
	// // 	options.ignoreTLS = true
	// // } else {
	// // 	options.tls = {
	// // 		ciphers: 'SSLv3',
	// // 		rejectUnauthorized: false
	// // 	}
	// // }
	// const transport = nodemailer.createTransport(options)
	// await transport.verify()

	// console.warn('Transport verified')
	// const messageOptions: SendMailOptions = {
	// 	from: config.fromAddress,
	// 	to,
	// 	subject,
	// 	text,
	// 	html
	// }

	// await transport.sendMail(messageOptions)
}
