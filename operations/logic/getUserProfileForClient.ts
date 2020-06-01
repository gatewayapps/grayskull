import { IUserClient } from '../../foundation/types/types'

import moment from 'moment'

import { userClientHasAllowedScope } from './userClientHasAllowedScope'
import { UserContext } from '../../foundation/context/getUserContext'
import { ScopeMap } from '../../foundation/constants/scopes'
import { ISubject, IProfileClaim, IEmailClaim, IMetaClaim } from '../../foundation/types/tokens'
import { getUserClientMetadata } from '../data/userClientMeta/getUserClientMetadata'
import Knex from 'knex'

export async function getUserProfileForClient(
	userAccount: UserContext,
	userClient: IUserClient,
	dataContext: Knex
): Promise<ISubject & IProfileClaim & IEmailClaim & IMetaClaim> {
	const result: ISubject & IProfileClaim & IEmailClaim & IMetaClaim = { sub: userClient.userClientId }
	if (userClientHasAllowedScope(userClient, ScopeMap.profile.id)) {
		result.given_name = userAccount.firstName
		result.family_name = userAccount.lastName
		result.nickname = userAccount.displayName
		result.picture = userAccount.profileImageUrl
		result.updated_at = moment(userAccount.updatedAt).unix()
		result.name = `${userAccount.firstName} ${userAccount.lastName}`
	}
	if (userClientHasAllowedScope(userClient, ScopeMap['profile:meta'].id)) {
		const metadata = await getUserClientMetadata(userClient.userClientId, dataContext)
		result.meta = metadata.reduce((p, c) => {
			p[c.key] = c.value
			return p
		}, {})
	}
	if (userClientHasAllowedScope(userClient, ScopeMap.email.id)) {
		result.email = userAccount.emailAddress
		result.email_verified = userAccount.emailAddressVerified
	}
	return result
}
