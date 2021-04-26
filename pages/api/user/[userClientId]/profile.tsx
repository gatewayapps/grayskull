import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../../foundation/context/prepareRemoteContext'
import { IAuthorizedUserFields } from '../../../../foundation/types/shared'

import { updateUserAccountByUserClientIdActivity } from '../../../../activities/clientOnly/updateUserAccountByUserClientIdActivity'
import { setUserAccountPrimaryEmailByUserClientIdActivity } from '../../../../activities/clientOnly/setUserAccountPrimaryEmailByUserClientIdActivity'
import { cors, runMiddleware } from '../../../../operations/middleware/cors'

export default async function profile(req: NextApiRequest, res: NextApiResponse) {
	await runMiddleware(req, res, cors)
	if (req.method !== 'POST') {
		res.status(405)
		return
	}
	try {
		const context = await prepareRemoteContext(req, res)
		if (!context.accessToken) {
			res.status(403).end()
			return
		}

		const userData = req.body as IAuthorizedUserFields
		const profile = await updateUserAccountByUserClientIdActivity(
			req.query['userClientId'].toString(),
			{
				birthday: userData.birthday || null,
				firstName: userData.given_name,
				lastName: userData.family_name,
				gender: userData.gender,
				displayName: userData.nickname,
				profileImageUrl: userData.picture
			},
			context
		)

		if (userData.email && profile) {
			await setUserAccountPrimaryEmailByUserClientIdActivity(
				req.query['userClientId'].toString(),
				userData.email,
				context
			)
			profile.email = userData.email
		}

		res.json(profile)
	} catch (err) {
		res.status(400).json({ success: false, error: err.message })
	}
}
