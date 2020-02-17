import { IClientFilter } from '../../../foundation/types/filterTypes'
import { DataContext } from '../../../foundation/context/getDataContext'
import { convertFilterToSequelizeWhere } from '../../../server/utils/graphQLSequelizeConverter'

export async function countClients(filter: IClientFilter, dataContext: DataContext) {
  const convertedFilter = convertFilterToSequelizeWhere(filter)
  return await dataContext.Client.count({ where: convertedFilter })
}
