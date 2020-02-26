import { DataContext } from '../../../foundation/context/getDataContext'

export async function getClient(clientId: string, dataContext: DataContext, includeSensitive = false) {
	const exclude = includeSensitive ? [] : ['secret']
	return dataContext.Client.findOne({ where: { client_id: clientId }, attributes: { exclude } })
}
