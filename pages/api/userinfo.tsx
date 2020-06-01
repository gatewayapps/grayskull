import { NextApiRequest, NextApiResponse } from 'next'
import { getClientRequestOptionsFromRequest } from '../../operations/logic/authentication'
import { ScopeMap } from '../../foundation/constants/scopes'
import { ensureScope } from '../../operations/logic/ensureScope'
import { IClientRequestOptions } from '../../foundation/models/IClientRequestOptions'

import { prepareContext, IRequestContext } from '../../foundation/context/prepareContext'
import { getUserProfileForClient } from '../../operations/logic/getUserProfileForClient'
import { updateUserAccountActivity } from '../../activities/updateUserAccountActivity'
import { IUserAccount } from '../../foundation/types/types'

async function getUserProfile(clientOptions: IClientRequestOptions, context: IRequestContext) {
	const isClientAuthorized = await ensureScope(ScopeMap.openid.id, context)
	if (!isClientAuthorized) {
		context.res.status(403)
		return
	}

	const profile = await getUserProfileForClient(
		clientOptions.userAccount!,
		clientOptions.userClient!,
		context.dataContext
	)

	context.res.json(profile)
}

async function postUserProfile(clientOptions: IClientRequestOptions, context: IRequestContext) {
	const isClientAuthorized = await ensureScope(ScopeMap['profile:write'].id, context)
	if (!isClientAuthorized) {
		context.res.status(403)
		return
	}

	try {
		const reqBody: IUserAccount = context.req.body as IUserAccount
		if (reqBody) {
			const { firstName, lastName, displayName, gender, birthday } = reqBody
			await updateUserAccountActivity(
				clientOptions.userAccount!.userAccountId,
				{
					firstName,
					lastName,
					displayName,
					gender,
					birthday
				} as any,
				context
			)

			const response = await getUserProfileForClient(
				clientOptions.userAccount!,
				clientOptions.userClient!,
				context.dataContext
			)
			context.res.json({ success: true, profile: response })
			return
		}
	} catch (err) {
		context.res.json({ success: false, message: err.message })
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const context = await prepareContext(req, res)

	const clientOptions = await getClientRequestOptionsFromRequest(context)
	switch (req.method) {
		case 'GET': {
			getUserProfile(clientOptions!, context)
			break
		}
		case 'POST': {
			postUserProfile(clientOptions!, context)
			break
		}
		default: {
			res.status(405).json({ success: false, message: 'Method not allowed' })
		}
	}
}
