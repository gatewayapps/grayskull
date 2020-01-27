import { getInMemoryContext } from '../../../context/getDataContext.spec'
import { DataContext } from '../../../context/getDataContext'

let dataContext: DataContext

describe('getUserContext', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })

  it('Should correctly return a user from the data context', async () => {})
})
