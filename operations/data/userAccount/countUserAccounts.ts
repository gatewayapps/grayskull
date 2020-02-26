import { DataContext } from '../../../foundation/context/getDataContext'

export async function countUserAccounts(context: DataContext) {
	return await context.UserAccount.count()
}
