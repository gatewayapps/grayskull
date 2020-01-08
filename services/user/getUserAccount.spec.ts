import { getUserAccount } from './getUserAccount'
import { getDataContext, DataContext } from '../../context/getDataContext'
import { getInMemoryContext } from '../../context/getDataContext.spec'
import { getCacheContext } from '../../context/getCacheContext'

let dataContext: DataContext

describe('getUserContext', () => {
  beforeAll(async () => {
    dataContext = await getInMemoryContext()
  })

  it('Should correctly return a user from the data context', async () => {})
})
