import { IUserAccount } from '../data/models/IUserAccount'
import { FindOptionsOrderArray, IncludeOptions, Model, Transaction, col, fn, literal } from 'sequelize'

export interface IQueryOptions {
  userContext: IUserAccount | null
  order?: string | col | literal | FindOptionsOrderArray | fn | Array<string | col | literal | FindOptionsOrderArray | fn>
  include?: Array<Model<any, any> | IncludeOptions>
  limit?: number
  offset?: number
  transaction?: Transaction
}
