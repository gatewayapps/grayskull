import Knex from 'knex'
import { IAuthorizedUser } from '../../../foundation/types/shared'

export async function getAuthorizedUserForClient(userClientId: string, clientId: string, dataContext: Knex) {
	return await dataContext
		.from('UserClients AS uc')
		.join('UserAccounts AS ua', { 'uc.userAccountId': 'ua.userAccountId' })
		.join('EmailAddresses AS ea', { 'ua.userAccountId': 'ea.userAccountId' })
		.where({ 'uc.client_id': clientId, 'ea.primary': true, 'uc.userClientId': userClientId })
		.select<IAuthorizedUser>({
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
		.first()
}
