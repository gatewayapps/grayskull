import { NextApiRequest, NextApiResponse } from 'next'
import { getClientRequestOptionsFromRequest } from '../../../../operations/logic/authentication'

import { ScopeMap } from '../../../../foundation/constants/scopes'

import { getUserClient } from '../../../../operations/data/userClient/getUserClient'
import { Permissions } from '../../../../foundation/constants/permissions'
import { ensureScope } from '../../../../operations/logic/ensureScope'
import { prepareContext } from '../../../../foundation/context/prepareContext'
import { getUserProfileForClient } from '../../../../operations/logic/getUserProfileForClient'
import { userClientHasAllowedScope } from '../../../../operations/logic/userClientHasAllowedScope'
import { updateUserAccountActivity } from '../../../../activities/updateUserAccountActivity'
import { IUserAccount } from '../../../../foundation/types/types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const context = await prepareContext(req, res)
	const requestContext = context.req

	const fullPath = requestContext.parsedUrl.pathname
	const targetUserAccountId = fullPath.replace('/users/', '').replace('/userinfo', '')
	if (!targetUserAccountId) {
		res.json({ success: false, message: 'Missing user account id' })
		return
	}

	const clientOptions = await getClientRequestOptionsFromRequest(requestContext)

	const isClientAuthorized = await ensureScope(ScopeMap['admin-profile:write'].id, requestContext)
	if (!isClientAuthorized || !clientOptions?.userAccount || !clientOptions.userClient) {
		res.status(403)
		return
	}

	if (clientOptions.userAccount.permissions! >= Permissions.Admin) {
		try {
			// Get the calling user's user client to check permissions
			const callingUserClient = await getUserClient(
				clientOptions.userAccount.userAccountId,
				clientOptions.userClient.client_id,
				context.dataContext
			)

			// Has the calling user granted admin-profile:write to the calling client
			if (callingUserClient && userClientHasAllowedScope(callingUserClient, ScopeMap['admin-profile:write'].id)) {
				const reqBody: IUserAccount = req.body as IUserAccount

				if (reqBody) {
					const { firstName, lastName, displayName, gender, birthday } = reqBody

					// We need to get the UserClient for the target user
					const targetUserClient = await getUserClient(
						targetUserAccountId,
						clientOptions.userClient.client_id,
						context.dataContext
					)

					// Has the target user authorized the target client
					if (targetUserClient) {
						await updateUserAccountActivity(
							targetUserAccountId,
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
							clientOptions.userAccount,
							clientOptions.userClient,
							context.dataContext
						)
						res.json({ success: true, profile: response })
						return
					} else {
						res.json({ success: false, message: 'Unable to find a user with that id' })
					}
				}
			} else {
				res.json({ success: false, message: 'Not authorized' })
			}
		} catch (err) {
			res.json({ success: false, message: err.message })
		}
	} else {
		res.json({ succes: false, message: 'You must be an administrator to do that' })
	}
}
