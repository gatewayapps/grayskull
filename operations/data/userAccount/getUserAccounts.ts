import { DataContext } from '../../../foundation/context/getDataContext'

export async function getUserAccounts(context: DataContext) {
	return context.UserAccount.findAll({
		order: [
			['lastName', 'asc'],
			['firstName', 'asc']
		]
	})
}
