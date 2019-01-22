import { IUserAccount } from '@data/models/IUserAccount'
import { Transaction } from 'sequelize'

export interface IServiceOptions {
  userContext: IUserAccount | null
  transaction?: Transaction
}
