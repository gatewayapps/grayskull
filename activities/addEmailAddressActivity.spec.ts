import knex from 'knex'
import { UserContext } from '../foundation/context/getUserContext'
import { IRequestContext } from '../foundation/context/prepareContext'
import { addEmailAddressActivity } from './addEmailAddressActivity'
jest.mock('../operations/data/emailAddress/createEmailAddress')
describe('addEmailAddressActivity', () => {
	let dataContext: knex

	let context: IRequestContext
	beforeAll(() => {
		context = ({
			knex
		} as any) as IRequestContext
	})
	it('Should throw if not logged in', () => {
		expect(addEmailAddressActivity('email@test.com', context)).rejects.toThrowError('You must be signed in to do that')
	})

	it('Should call createEmailAddress', () => {
		context = ({
			dataContext,
			user: ({
				userAccountId: '1234'
			} as any) as UserContext
		} as any) as IRequestContext
		const createEmail = require('../operations/data/emailAddress/createEmailAddress')
		const createEmailSpy = spyOn(createEmail, 'createEmailAddress')
		addEmailAddressActivity('email@test.com', context)
		expect(createEmailSpy).toBeCalledTimes(1)
	})
})
