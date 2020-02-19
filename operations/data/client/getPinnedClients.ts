import { DataContext } from '../../../foundation/context/getDataContext'

export async function getPinnedClients(dataContext: DataContext) {
  return dataContext.Client.findAll({ where: { pinToHeader: true } })
}
