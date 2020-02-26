import { IAccessToken } from '../types/tokens'
import { UserContext } from '../context/getUserContext'
import { IUserClient } from '../types/types'

export interface IClientRequestOptions {
	userAccount: UserContext
	client: IUserClient
	accessToken: IAccessToken
}
