jest.mock('sequelize')
import Sequelize from 'sequelize'
import { getDataContext } from './getDataContext'

describe('getDataContext', () => {
  it('should correctly return a data context', async () => {
    const options: Sequelize.Options = {
      database: 'test',
      dialect: 'sqlite',
      storage: './test.db',
      host: '/'
    }
  })
})
