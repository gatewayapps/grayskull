import { NextApiRequest } from 'next'

export function getClientCredentialsFromRequest(req: NextApiRequest) {
	if (req.headers.authorization) {
		const b64 = req.headers.authorization.replace('Basic ', '')
		const buf = Buffer.from(b64, 'base64')
		const stringContents = buf.toString('utf8')
		const authParts = stringContents.split(':')
		return {
			client_id: authParts[0],
			client_secret: authParts[1]
		}
	} else {
		if (req.body.client_id) {
			return {
				client_id: req.body.client_id,
				client_secret: req.body.client_secret
			}
		} else {
			return undefined
		}
	}
}
