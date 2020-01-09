import Sequelize from 'sequelize'
import { getDataContext } from './getDataContext'

export async function getInMemoryContext() {
  const options: Sequelize.Options = {
    database: 'grayskull',
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  }

  return await getDataContext(options)
}

describe('getDataContext', () => {
  it('should correctly return a data context', async () => {
    const dc = await getInMemoryContext()

    expect(dc.Client).toBeDefined()
    expect(dc.EmailAddress).toBeDefined()
    expect(dc.KeyValueCache).toBeDefined()
    expect(dc.PhoneNumber).toBeDefined()
    expect(dc.RefreshToken).toBeDefined()
    expect(dc.Session).toBeDefined()
    expect(dc.Setting).toBeDefined()
    expect(dc.UserAccount).toBeDefined()
    expect(dc.UserClient).toBeDefined()
    expect(dc.sequelize).toBeDefined()
  })
})
