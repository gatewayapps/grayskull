import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'
import { ScopeMap } from '../../../../foundation/constants/scopes'
import { changePasswordFromClientActivity } from '../../../../activities/authentication/changePasswordWithOldPasswordFromClientActivity'

import { cors, runMiddleware } from '../../../../operations/middleware/cors'

export default async function profile(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors)
	if (req.method !== 'POST') {
		res.status(405)
		return
	}
	try {
		const context = await prepareRemoteContext(req, res)
		if (!context.accessToken || context.accessTokenType !== 'user') {
			res.status(403).end()
			return
		}
		if (!context.user || !context.accessToken.scopes.includes(ScopeMap['profile:write'].id)) {
			res.status(403).end()
			return
		}

		const { oldPassword, newPassword } = context.req.body

		await changePasswordFromClientActivity(req.query['userClientId'].toString(), oldPassword, newPassword, context)
		res.json({ success: true })
	} catch (err) {
		if (err instanceof Error) {
			res.json({ success: false, reason: err.message })
		} else {
			res.json({ success: false, reason: 'Unknown error' })
		}
	}
}
