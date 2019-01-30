import { IUserAccount } from './models/IUserAccount'
import { IClient } from './models/IClient'

export interface IClientRequestOptions {
  userAccount: IUserAccount
  client: IClient
}
