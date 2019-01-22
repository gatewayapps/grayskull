import _ from 'lodash'
import { IUserAccount } from '@data/models/IUserAccount'
import UserClientServiceBase from '@services/UserClientServiceBase'
import ClientService from './ClientService'
import { UserClientInstance } from '@data/models/UserClient'
import { IUserClientUniqueFilter } from '@/interfaces/graphql/IUserClient'
import { IServiceOptions } from './IServiceOptions'
import { getContext } from '@data/context'

export interface IVerifyScopeResult {
  approvedScopes?: string[]
  pendingScopes?: string[]
  userClientId?: string
}

class UserClientService extends UserClientServiceBase {
  public async verifyScope(userAccountId: string, client_id: string, scope: string | null, options: IServiceOptions): Promise<IVerifyScopeResult> {
    const client = await ClientService.getClient({ client_id }, options)
    if (!client) {
      throw new Error(`Unknown client: ${client_id}`)
    }

    const requestedScopes: string[] = scope ? scope.split(/[, ]/) : JSON.parse(client.scopes)

    const userClient = await super.getUserClient({ userAccountId, client_id }, options)
    if (!userClient) {
      return {
        pendingScopes: requestedScopes
      }
    }

    const allowedScopes: string[] = JSON.parse(userClient.allowedScopes)
    const deniedScopes: string[] = JSON.parse(userClient.deniedScopes)
    const pendingScopes = requestedScopes.filter((rs) => !allowedScopes.includes(rs) && !deniedScopes.includes(rs))

    if (pendingScopes.length > 0) {
      return {
        pendingScopes
      }
    }

    return {
      approvedScopes: allowedScopes.filter((allow) => requestedScopes.includes(allow)),
      userClientId: userClient.userClientId
    }
  }

  //TODO: Should be admin or self
  async getUserClient(filter: IUserClientUniqueFilter, options: IServiceOptions): Promise<UserClientInstance | null> {
    return super.getUserClient(filter, options)
  }
  //TODO: Should be admin
  public async updateScopes(userAccount: IUserAccount, client_id: string, allowedScopes: string[], deniedScopes: string[], options: IServiceOptions): Promise<void> {
    const client = await ClientService.getClient({ client_id }, options)
    if (!client) {
      throw new Error(`Unknown client: ${client_id}`)
    }
    const userClient = await super.getUserClient({ userAccountId: userAccount.userAccountId, client_id }, options)
    if (!userClient) {
      // create a new userClient
      await super.createUserClient(
        {
          userAccountId: userAccount.userAccountId!,
          client_id,
          allowedScopes: JSON.stringify(allowedScopes),
          deniedScopes: JSON.stringify(deniedScopes)
        },
        options
      )
    } else {
      // update existing userClient
      const prevAllowedScopes: string[] = JSON.parse(userClient.allowedScopes)
      const prevDeniedScopes: string[] = JSON.parse(userClient.deniedScopes)

      // add new denied to previous denied
      const newDeniedScopes = _.uniq(prevDeniedScopes.concat(deniedScopes)).filter((denied) => !allowedScopes.includes(denied))
      const newAllowedScopes = _.uniq(prevAllowedScopes.concat(allowedScopes)).filter((allowed) => !newDeniedScopes.includes(allowed))
      await super.updateUserClient(
        { userClientId: userClient.userClientId! },
        {
          allowedScopes: JSON.stringify(newAllowedScopes),
          deniedScopes: JSON.stringify(newDeniedScopes)
        },
        options
      )
    }
  }
}

export default new UserClientService()
