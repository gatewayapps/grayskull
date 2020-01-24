import Sequelize from 'sequelize'
import { DataContext } from '../../context/getDataContext'

export async function flushExpiredValues(dataContext: DataContext) {
  await dataContext.KeyValueCache.destroy({
    where: {
      expires: {
        [Sequelize.Op.lte]: new Date()
      }
    }
  })
}
