import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'
import { ScopeMap } from '../../../../foundation/constants/scopes'
import { changePasswordFromClientActivity } from '../../../../activities/authentication/changePasswordWithOldPasswordFromClientActivity'

export default async function profile(req: NextApiRequest, res: NextApiResponse) {
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
		res.json({ success: false, message: err.message })
	}
}
