import { IUserAccount } from '@data/models/IUserAccount'
import { Transaction, Model, IncludeOptions, col, literal, FindOptionsOrderArray, fn } from 'sequelize'

export interface IQueryOptions {
  userContext: IUserAccount | null
  order?: string | col | literal | FindOptionsOrderArray | fn | Array<string | col | literal | FindOptionsOrderArray | fn>
  include?: Array<Model<any, any> | IncludeOptions>
  limit?: number
  offset?: number
  transaction?: Transaction
}
