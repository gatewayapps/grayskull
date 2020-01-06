import { UserAccount } from './models/UserAccount'
import { Client } from './models/Client'
import { IAccessToken } from '../api/services/TokenService'

export interface IClientRequestOptions {
  userAccount: UserAccount
  client: Client
  accessToken: IAccessToken
}
