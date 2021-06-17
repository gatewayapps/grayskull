/* eslint-disable indent */
import { NextApiRequest, NextApiResponse } from 'next'
import { getPinnedClientsActivity } from '../../activities/getPinnedClientsActivity'
import { countUserAccounts } from '../../operations/data/userAccount/countUserAccounts'
import { prepareContext } from '../../foundation/context/prepareContext'
import { PASSWORD_PLACEHOLDER } from '../../foundation/constants'
import { maskPhoneNumber } from '../../operations/logic/maskPhoneNumber'
import { sanitizeConfiguration } from '../../operations/logic/sanitizeConfiguration'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const context = await prepareContext(req, res)

	const configuration = sanitizeConfiguration(context.configuration)

	const pinnedClients = context.user ? await getPinnedClientsActivity(context) : []

	configuration.HeaderItems = pinnedClients
	const needsConfiguration = !configuration.Server?.baseUrl

	const needsAdmin = (await countUserAccounts(context.dataContext)) === 0
	let finalUserContext: any = null
	if (context.user) {
		finalUserContext = {
			userAccountId: context.user.userAccountId,
			firstName: context.user.firstName,
			lastName: context.user.lastName,
			gender: context.user.gender,
			birthday: context.user.birthday,
			displayName: context.user.displayName,
			lastPasswordChange: context.user.lastPasswordChange,
			profileImageUrl: context.user.profileImageUrl,
			emailAddress: context.user.emailAddress,
			permissions: context.user.permissions,
			otpEnabled: context.user.otpEnabled
		}

		if (context.user.phoneNumber) {
			finalUserContext.phoneNumber = maskPhoneNumber(context.user.phoneNumber)
		}
	}

	res.json({
		configuration,
		needsConfiguration,
		needsAdmin,
		user: finalUserContext
	})
}
