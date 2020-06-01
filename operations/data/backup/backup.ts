import Knex from 'knex'
import { encrypt } from '../../logic/encryption'
import {
	IUserAccount,
	IClient,
	IUserClient,
	ISetting,
	IEmailAddress,
	IRefreshToken,
	ISession,
	IPhoneNumber
} from '../../../foundation/types/types'

export const backup = async (dataContext: Knex) => {
	const userAccounts = await dataContext<IUserAccount>('UserAccounts').select('*')
	const clients = await dataContext<IClient>('Clients').select('*')
	const userClients = await dataContext<IUserClient>('UserClients').select('*')
	const settings = await dataContext<ISetting>('Settings').select('*')
	const emailAddresses = await dataContext<IEmailAddress>('EmailAddresses').select('*')
	const refreshTokens = await dataContext<IRefreshToken>('RefreshTokens').select('*')
	const sessions = await dataContext<ISession>('Sessions').select('*')
	const phoneNumbers = await dataContext<IPhoneNumber>('PhoneNumbers').select('*')

	const json = JSON.stringify({
		userAccounts,
		clients,
		userClients,
		settings,
		emailAddresses,
		refreshTokens,
		sessions,
		phoneNumbers
	})

	const encrypted = encrypt(json)

	return encrypted
}
