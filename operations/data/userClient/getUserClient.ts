import { DataContext } from '../../../foundation/context/getDataContext'

export async function getUserClient(userAccountId: string, client_id: string, context: DataContext) {
	return context.UserClient.findOne({ where: { userAccountId, client_id } })
}
