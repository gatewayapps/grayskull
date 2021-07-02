jest.mock('../../operations/services/mail/sendEmailTemplate', () => ({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	sendTemplatedEmail: () => {},
	activateLink: undefined
}))
import Knex from 'knex'
import { Permissions } from '../../foundation/constants/permissions'
import { getInMemoryContext } from '../../foundation/context/getDataContext.spec'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { IClient, IUserAccount } from '../../foundation/types/types'
import { createTestClient } from '../../operations/data/client/createClient.spec'
import { createTestUserAccount } from '../../operations/data/userAccount/createUserAccount.spec'
import { createUserClient } from '../../operations/data/userClient/createUserClient'
import { listUserAccountEmailAddressesActivity } from '../listUserAccountEmailAddressesActivity'
import { createUserAccountActivity } from './createUserAccountActivity'

let dataContext: Knex
let authorizedUser: IUserAccount
let restrictedUser: IUserAccount
let testClient: IClient

function getUserAccount(getPassword = false): IUserAccount {
	const userAccount: IUserAccount = {
		userAccountId: '12345',
		firstName: 'john',
		lastName: 'doe',
		displayName: null,
		gender: null,
		birthday: null,
		profileImageUrl: null,
		permissions: 1,
		otpSecret: null,
		otpEnabled: false,
		isActive: true,
		createdBy: null,
		createdAt: new Date(),
		updatedBy: null,
		updatedAt: new Date(),
		deletedBy: null,
		deletedAt: null,
		lastActive: new Date(),
		lastPasswordChange: new Date(),
		passwordHash: ''
	}
	if (getPassword) userAccount.password = 'password'
	return userAccount
}

describe('createUserAccountActivity', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()

		authorizedUser = await createTestUserAccount(dataContext)
		restrictedUser = await createTestUserAccount(dataContext)
		testClient = await createTestClient(dataContext)

		await createUserClient(
			authorizedUser.userAccountId,
			testClient.client_id,
			['openid', 'offline_access'],
			[],
			dataContext
		)

		await createUserClient(
			restrictedUser.userAccountId,
			testClient.client_id,
			[],
			['openid', 'offline_access'],
			dataContext
		)
	})

	it('Should receive email address is unavailable', async () => {
		const userAccountDetails = getUserAccount(true)
		let failed = false
		try {
			await createUserAccountActivity(userAccountDetails, 'email@testemail.com', {
				dataContext,
				user: { permissions: Permissions.Admin }
			} as IRequestContext)
			await createUserAccountActivity(userAccountDetails, 'email@testemail.com', {
				dataContext,
				user: { permissions: Permissions.Admin }
			} as IRequestContext)
		} catch {
			failed = true
		}
		expect(failed).toBeTruthy()
	})

	it('Should create user with verified email adress -password passed', async () => {
		const userAccountDetails = getUserAccount(true)
		let isVerified = false
		try {
			await createUserAccountActivity(userAccountDetails, 'test14624646w36@testemail.com', {
				dataContext,
				user: { permissions: Permissions.Admin }
			} as IRequestContext)
			const emails = await listUserAccountEmailAddressesActivity(userAccountDetails.userAccountId, {
				dataContext,
				user: { permissions: Permissions.Admin }
			} as IRequestContext)
			isVerified = emails[0].verified
		} catch (error) {
			isVerified = false
		}
		expect(isVerified).toBe(1)
	})

	it('Should create user with unverified email adress -no password passed', async () => {
		const getTemplatedEmail = require('../../operations/services/mail/sendEmailTemplate')
		const userAccountDetails = getUserAccount()
		const getEmailSpy = jest.spyOn(getTemplatedEmail, 'sendTemplatedEmail')
		let isVerified = false
		try {
			await createUserAccountActivity(userAccountDetails, 'testnopassword@exmaple.com', {
				dataContext,
				user: { permissions: Permissions.Admin },
				configuration: { Server: { baseUrl: 'http://localhost:5000' } }
			} as IRequestContext)
			const emails = await listUserAccountEmailAddressesActivity(userAccountDetails.userAccountId, {
				dataContext,
				user: { permissions: Permissions.Admin }
			} as IRequestContext)
			isVerified = emails[0].verified
		} catch (error) {
			isVerified = false
		}

		expect(isVerified).toBe(0)
		expect(getEmailSpy).toBeCalledTimes(1)
	})
})
