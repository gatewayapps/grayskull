import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'
import { OauthError } from '../../../../foundation/errors/OauthError'
import { createUserAccountForClientActivity } from '../../../../activities/clientOnly/createUserAccountForClientActivity'
import { cors, runMiddleware } from '../../../../operations/middleware/cors'

export default async function createUserAccount(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors)
	if (req.method !== 'POST') {
		res.status(405)
		return
	}
	try {
		const context = await prepareRemoteContext(req, res)
		if (context.accessTokenType !== 'client') {
			res.status(403)
			return
		}

		if (!req.body) {
			res.status(400).json(new OauthError('invalid_request', 'No body provided to createUserAccount'))
			return
		}

		const { password, ...body } = req.body

		const result = await createUserAccountForClientActivity(body, password, req.query['client_id'].toString(), context)

		res.status(201).json(result)
	} catch (err) {
		if (err instanceof Error) {
			res.status(403).json({ success: false, reason: err.message })
		} else {
			res.status(403).json({ success: false, reason: 'Unknown error' })
		}
	}
}
