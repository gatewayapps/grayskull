import _ from 'lodash'
import { IUserAccount } from '../../data/models/IUserAccount'

import ClientService from './ClientService'
import { UserClientInstance } from '../../data/models/UserClient'
import { IUserClientUniqueFilter } from '../../interfaces/graphql/IUserClient'
import { IQueryOptions } from '../../data/IQueryOptions'
import db from '../../data/context'
import UserClientRepository from '../../data/repositories/UserClientRepository'
import { hasPermission } from '../../decorators/permissionDecorator'
import { Permissions } from '../../utils/permissions'
import AuthorizationHelper from '../../utils/AuthorizationHelper'
import ClientRepository from '../../data/repositories/ClientRepository'
import { IUserClient } from '../../data/models/IUserClient'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'
import { ScopeMap } from './ScopeService'

export interface IVerifyScopeResult {
  approvedScopes?: string[]
  pendingScopes?: string[]
  userClientId?: string
}

class UserClientService {
  public async verifyScope(userAccountId: string, client_id: string, scope: string | null, options: IQueryOptions): Promise<IVerifyScopeResult> {
    const client = await ClientRepository.getClient({ client_id }, options)
    if (!client) {
      throw new Error(`Unknown client: ${client_id}`)
    }
    const clientScopes = JSON.parse(client.scopes)
    const userAccount = await UserAccountRepository.getUserAccount({ userAccountId }, options)

    const requestedScopes: string[] = (scope ? scope.split(/[, ]/) : JSON.parse(client.scopes))
      .filter((s) => clientScopes.includes(s))
      .filter((rs) => ScopeMap[rs].permissionLevel <= userAccount!.permissions!)

    const userClient = await UserClientRepository.getUserClient({ userAccountId, client_id }, options)

    if (!userClient) {
      return {
        pendingScopes: requestedScopes
      }
    }

    const allowedScopes: string[] = JSON.parse(userClient.allowedScopes)
    const deniedScopes: string[] = JSON.parse(userClient.deniedScopes)
    const pendingScopes = requestedScopes.filter((rs) => !allowedScopes.includes(rs) && !deniedScopes.includes(rs) && ScopeMap[rs].permissionLevel <= userAccount!.permissions!)

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

  public UserClientHasAllowedScope(userClient: IUserClient | null, scope: string) {
    if (!userClient) {
      return false
    }

    if (!userClient.allowedScopes) {
      return false
    }

    try {
      const allowedScopes: string[] = JSON.parse(userClient.allowedScopes)
      return allowedScopes.includes(scope)
    } catch (err) {
      return false
    }
  }

  @hasPermission(Permissions.User)
  async getUserClient(filter: IUserClientUniqueFilter, options: IQueryOptions): Promise<IUserClient | null> {
    if (!AuthorizationHelper.isAdmin(options.userContext)) {
      filter = Object.assign({ userAccountId: options.userContext!.userAccountId }, filter)
    }
    return UserClientRepository.getUserClient(filter, options)
  }

  @hasPermission(Permissions.User)
  public async updateScopes(userAccount: IUserAccount, client_id: string, allowedScopes: string[], deniedScopes: string[], options: IQueryOptions): Promise<void> {
    const client = await ClientRepository.getClient({ client_id }, options)
    if (!client) {
      throw new Error(`Unknown client: ${client_id}`)
    }
    const userClient = await UserClientRepository.getUserClient({ userAccountId: userAccount.userAccountId, client_id }, options)
    if (!userClient) {
      // create a new userClient
      await UserClientRepository.createUserClient(
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
      await UserClientRepository.updateUserClient(
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