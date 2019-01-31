import { IUserAccount } from '@data/models/IUserAccount'
import { Transaction } from 'sequelize'

export interface IQueryOptions {
  userContext: IUserAccount | null

  transaction?: Transaction
}
