import { DataContext } from '../../../foundation/context/getDataContext'

export async function getClient(clientId: string, dataContext: DataContext) {
  return dataContext.Client.findOne({ where: { client_id: clientId } })
}
