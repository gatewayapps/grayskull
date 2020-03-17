import { IRequestContext } from '../../foundation/context/prepareContext'
import { getAuthorizedUsers } from '../../operations/data/client/getAuthorizedUsers'

export async function listAuthorizedUsersActivity(clientId: string, limit = 100, offset = 0, context: IRequestContext) {
	return getAuthorizedUsers(clientId, limit, offset, context.dataContext)
}
