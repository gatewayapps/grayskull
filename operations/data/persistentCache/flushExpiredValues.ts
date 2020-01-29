import Sequelize from 'sequelize'
import { DataContext } from '../../../foundation/context/getDataContext'

export async function flushExpiredValues(dataContext: DataContext) {
  await dataContext.KeyValueCache.destroy({
    where: {
      expires: {
        [Sequelize.Op.lte]: new Date()
      }
    }
  })
}
