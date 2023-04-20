import { createTransport } from 'nodemailer'

export async function verifyMailConfiguration(config: {
	serverAddress: string
	port: number
	secure: boolean
	username: string
	password: string
}) {
	const options: any = {
		host: config.serverAddress,
		port: config.port,
		secure: config.secure,
		auth: config.username ?? {
			user: config.username,
			pass: config.password
		},
		tls: {
			ciphers: 'SSLv3'
		}
	}

	console.warn(JSON.stringify({ ...options, auth: { user: config.username, more: config.password } }))

	// if (process.env.NODE_ENV !== 'production') {
	// 	options.ignoreTLS = true
	// } else {
	// 	options.tls = {
	// 		ciphers: 'SSLv3',
	// 		rejectUnauthorized: false
	// 	}
	// }
	const transport = createTransport(options)

	return await transport.verify()
}
