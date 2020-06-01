import { compare } from 'bcrypt'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'
import Knex from 'knex'
import { getUserAccount } from './getUserAccount'

export async function verifyPassword(userAccountId: string, password: string, dataContext: Knex): Promise<boolean> {
	const userAccount = await getUserAccount(userAccountId, dataContext, undefined, true)
	if (!userAccount) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidUserAccountId,
			`Attempted to verify a password for user account ${userAccountId}, which does not exist`
		)
	}
	return await compare(password, userAccount.passwordHash)
}
