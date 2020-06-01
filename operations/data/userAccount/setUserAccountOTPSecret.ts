import Knex from 'knex'
import { IUserAccount } from '../../../foundation/types/types'

export async function setUserAccountOTPSecret(
	userAccountId: string,
	otpSecret: string,
	otpEnabled: boolean,
	dataContext: Knex
) {
	await dataContext<IUserAccount>('UserAccounts')
		.where({ userAccountId })
		.update({ otpSecret, otpEnabled })
}
