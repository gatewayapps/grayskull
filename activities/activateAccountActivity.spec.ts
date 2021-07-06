import Knex from 'knex'
import { getCacheContext } from '../foundation/context/getCacheContext'
import { getInMemoryContext } from '../foundation/context/getDataContext.spec'
import { IUserAccount } from '../foundation/types/types'
import { activateAccountActivity } from './activateAccountActivity'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { getValue } from '../operations/data/persistentCache/getValue'
import { IRequestContext } from '../foundation/context/prepareContext'

jest.mock('../operations/data/userAccount/getUserAccountByEmailAddress')
jest.mock('../operations/logic/getCacheKeyForUserAccountActivation')
jest.mock('../operations/data/persistentCache/getValue')
jest.mock('../operations/data/userAccount/setUserAccountActive')
jest.mock('../operations/data/userAccount/setUserAccountPassword')
jest.mock('../operations/data/persistentCache/clearValue')

beforeEach(() => {
	;(getUserAccountByEmailAddress as any).mockImplementation(async () => {
		return {
			userAccountId: '12345',
			lastName: 'doe',
			firstName: 'john',
			displayName: 'johndoe',
			passwordHash: '123',
			permissions: 1,
			otpEnabled: false,
			isActive: false,
			createdAt: new Date(),
			updatedAt: new Date(),
			lastActive: new Date(),
			lastPasswordChange: new Date(),
			gender: null,
			birthday: null,
			profileImageUrl: null,
			otpSecret: null,
			createdBy: null,
			updatedBy: null,
			deletedBy: null,
			deletedAt: null
		} as IUserAccount
	})
})

describe('activateAccountActivity', () => {
	let dataContext: Knex
	let cacheContext
	let context: IRequestContext
	beforeAll(async () => {
		dataContext = await getInMemoryContext()
		cacheContext = getCacheContext()
		context = {
			dataContext,
			cacheContext,
			configuration: {
				Security: {
					passwordMinimumLength: 8
				}
			}
		} as any
	})
	beforeEach(() => {
		jest.clearAllMocks()
	})
	it('Should error on non existing email', async () => {
		;(getUserAccountByEmailAddress as any).mockImplementation(async () => {
			throw new GrayskullError(
				GrayskullErrorCode.InvalidEmailAddress,
				`Attempted to activate user with email address fakeemail@email.com, which does not exist`
			)
		})

		expect(
			activateAccountActivity('fakeemail@email.com', 'password', 'completelyrealtoken', context)
		).rejects.toThrowError('Attempted to activate user with email address fakeemail@email.com, which does not exist')
	})

	/*Does call setUserAccountActive, setUseraccountPassword, and clearValue from cache*/

	it('Should error on expired token', async () => {
		;(getValue as any).mockImplementation(async () => {
			return null
		})

		expect(
			activateAccountActivity('fakeemail@email.com', 'password', 'completelyrealtoken', context)
		).rejects.toThrowError('The provided token is no longer valid for activating the user')
	})

	it('Should error on invalid token', async () => {
		;(getValue as any).mockImplementation(async () => {
			return 'notreallyarealtoken'
		})

		expect(
			activateAccountActivity('fakeemail@email.com', 'password', 'completelyrealtoken', context)
		).rejects.toThrowError('Attempted to activate an account with invalid token - completelyrealtoken')
	})

	it('Should error on weak password', async () => {
		;(getValue as any).mockImplementation(async () => {
			return 'completelyrealtoken'
		})

		expect(activateAccountActivity('fakeemail@email.com', 'pass', 'completelyrealtoken', context)).rejects.toThrowError(
			'Password must have at least 8 characters'
		)
	})

	it('Should call setUserAccountActive', async () => {
		const userAccountActive = require('../operations/data/userAccount/setUserAccountActive')
		const userActiveSpy = jest.spyOn(userAccountActive, 'setUserAccountActive')
		await activateAccountActivity('fakeemail@email.com', 'Th!sP455w0rdGood', 'completelyrealtoken', context)
		expect(userActiveSpy).toBeCalledTimes(1)
	})
	it('Should call setUserAccountActive', async () => {
		const userAccountPassword = require('../operations/data/userAccount/setUserAccountPassword')
		const userPasswordSpy = jest.spyOn(userAccountPassword, 'setUserAccountPassword')
		await activateAccountActivity('fakeemail@email.com', 'Th!sP455w0rdGood', 'completelyrealtoken', context)
		expect(userPasswordSpy).toBeCalledTimes(1)
	})
	it('Should call setUserAccountActive', async () => {
		const clearValue = require('../operations/data/persistentCache/clearValue')
		const clearValueSpy = jest.spyOn(clearValue, 'clearValue')
		await activateAccountActivity('fakeemail@email.com', 'Th!sP455w0rdGood', 'completelyrealtoken', context)
		expect(clearValueSpy).toBeCalledTimes(1)
	})
})
