import { NextApiRequest, NextApiResponse } from 'next'
import { prepareRemoteContext } from '../../../foundation/context/prepareRemoteContext'
import { ScopeMap } from '../../../foundation/constants/scopes'
import { IAuthorizedUserFields } from '../../../foundation/types/shared'
import { updateUserAccountActivity } from '../../../activities/updateUserAccountActivity'

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

		const userData = req.body as IAuthorizedUserFields
		const profile = await updateUserAccountActivity(
			context.user.userAccountId,
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

		res.json(profile)
	} catch (err) {
		res.status(400).json({ success: false, error: err.message })
	}
}
