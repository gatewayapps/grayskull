import { getUserAccount } from './getUserAccount'
import { getDataContext, DataContext } from '../../context/getDataContext'
import { getInMemoryContext } from '../../context/getDataContext.spec'
import { getCacheContext } from '../../context/getCacheContext'

let dataContext: DataContext

beforeAll(async () => {
  dataContext = await getInMemoryContext()
})

describe('getUserContext', () => {
  it('Should correctly return a user from the data context', async () => {})
})
