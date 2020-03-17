import Knex from 'knex'

export async function getAuthorizedUsers(clientId: string, limit: number, offset: number, dataContext: Knex) {
	return await dataContext
		.from('UserClients AS uc')
		.join('UserAccounts AS ua', { 'uc.userAccountId': 'ua.userAccountId' })
		.join('EmailAddresses AS ea', { 'ua.userAccountId': 'ea.userAccountId' })
		.where({ 'uc.client_id': clientId, 'ea.primary': true })
		.select(
			'uc.userClientId as sub',
			'ua.firstName as given_name',
			'ua.lastName as family_name',
			'ua.gender',
			'ua.birthday',
			'ua.lastActive as active_at',
			'ua.profileImageUrl as picture',
			'ua.displayName as nickname',
			'ua.updatedAt as updated_at',
			'ea.emailAddress as email',
			'ea.verified as email_verified'
		)
		.offset(offset)
		.limit(limit)
}
