import { UserAccount } from '../data/models/UserAccount'
import { Transaction, Includeable } from 'sequelize'

export interface IQueryOptions {
  userContext: UserAccount | null
  order?: any
  include?: Includeable[] | undefined
  limit?: number
  offset?: number
  transaction?: Transaction
}
