import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'

import { deactivateUserAccountByUserClientIdActivity } from '../../../../activities/clientOnly/deactivateUserAccountByUserClientIdActivity'

export default async function profile(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405)
		return
	}
	try {
		const context = await prepareRemoteContext(req, res)
		if (!context.accessToken || context.accessTokenType !== 'client') {
			res.status(403).end()
			return
		}

		await deactivateUserAccountByUserClientIdActivity(req.query['userClientId'].toString(), context)

		res.json({ success: true })
	} catch (err) {
		res.json({ success: false, message: err.message })
	}
}
