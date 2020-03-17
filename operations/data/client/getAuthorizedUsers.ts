import Knex from 'knex'
import { IAuthorizedUser } from '../../../foundation/types/shared'

export async function getAuthorizedUsers(clientId: string, limit: number, offset: number, dataContext: Knex) {
	return await dataContext
		.from('UserClients AS uc')
		.join('UserAccounts AS ua', { 'uc.userAccountId': 'ua.userAccountId' })
		.join('EmailAddresses AS ea', { 'ua.userAccountId': 'ea.userAccountId' })
		.where({ 'uc.client_id': clientId, 'ea.primary': true })
		.select<IAuthorizedUser[]>({
			sub: 'uc.userClientId',
			given_name: 'ua.firstName',
			family_name: 'ua.lastName',
			gender: 'ua.gender',
			birthday: 'ua.birthday',
			active_at: 'ua.lastActive',
			picture: 'ua.profileImageUrl',
			nickname: 'ua.displayName',
			updated_at: 'ua.updatedAt',
			email: 'ea.emailAddress',
			email_verified: 'ea.verified'
		})
		.offset(offset)
		.limit(limit)
}

/*'uc.userClientId as sub',
			'ua.firstName as given_name',
			'ua.lastName as family_name',
			'ua.gender',
			'ua.birthday',
			'ua.lastActive as active_at',
			'ua.profileImageUrl as picture',
			'ua.displayName as nickname',
			'ua.updatedAt as updated_at',
			'ea.emailAddress as email',
			'ea.verified as email_verified'*/
