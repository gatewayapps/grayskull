import { DataContext } from '../../../foundation/context/getDataContext'
import { compare } from 'bcrypt'
import { GrayskullError, GrayskullErrorCode } from '../../../foundation/errors/GrayskullError'

export async function verifyPassword(
	userAccountId: string,
	password: string,
	dataContext: DataContext
): Promise<boolean> {
	const userAccount = await dataContext.UserAccount.findOne({ where: { userAccountId } })
	if (!userAccount) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidUserAccountId,
			`Attempted to verify a password for user account ${userAccountId}, which does not exist`
		)
	}
	return await compare(password, userAccount.passwordHash)
}
