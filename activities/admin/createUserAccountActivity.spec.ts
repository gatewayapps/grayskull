jest.mock('../../operations/services/mail/sendEmailTemplate', () => ({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	sendTemplatedEmail: () => {},
	activateLink: undefined
}))
import Knex from 'knex'
import { Permissions } from '../../foundation/constants/permissions'
import { getInMemoryContext } from '../../foundation/context/getDataContext.spec'
import { IRequestContext } from '../../foundation/context/prepareContext'
import { IUserAccount } from '../../foundation/types/types'
import { getEmailAddressByEmailAddress } from '../../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { createUserAccountActivity } from './createUserAccountActivity'

let dataContext: Knex

function getUserAccount(password?: string): IUserAccount {
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
	if (password) {
		userAccount.password = password
	}
	return userAccount
}

describe('createUserAccountActivity', () => {
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
	})

	it('Should receive email address is unavailable', async () => {
		const userAccountDetails = getUserAccount('password')
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

	it('Should create user with verified email address -password passed', async () => {
		const userAccountDetails = getUserAccount('password')
		let isVerified: boolean | undefined = false
		try {
			await createUserAccountActivity(userAccountDetails, 'test1@testemail.com', {
				dataContext,
				user: { permissions: Permissions.Admin }
			} as IRequestContext)
			const email = await getEmailAddressByEmailAddress('test1@testemail.com', dataContext)
			isVerified = email && email.verified
		} catch (error) {
			isVerified = false
		}
		expect(isVerified).toBeTruthy()
	})

	it('Should create user with unverified email address -no password passed', async () => {
		const getTemplatedEmail = require('../../operations/services/mail/sendEmailTemplate')
		const userAccountDetails = getUserAccount()
		const getEmailSpy = jest.spyOn(getTemplatedEmail, 'sendTemplatedEmail')
		let isVerified: boolean | undefined = false
		try {
			await createUserAccountActivity(userAccountDetails, 'testnopassword@exmaple.com', {
				dataContext,
				user: { permissions: Permissions.Admin },
				configuration: { Server: { baseUrl: 'http://localhost:5000' } }
			} as IRequestContext)
			const email = await getEmailAddressByEmailAddress('testnopassword@exmaple.com', dataContext)
			isVerified = email && email.verified
		} catch (error) {
			isVerified = false
		}

		expect(isVerified).toBeFalsy()
		expect(getEmailSpy).toBeCalledTimes(1)
	})
})
