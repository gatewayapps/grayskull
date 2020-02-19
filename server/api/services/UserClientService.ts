import _ from 'lodash'

import { IUserClientUniqueFilter } from '../../interfaces/graphql/IUserClient'
import { IQueryOptions } from '../../../foundation/models/IQueryOptions'

import UserClientRepository from '../../data/repositories/UserClientRepository'
import { hasPermission } from '../../decorators/permissionDecorator'
import { Permissions } from '../../../foundation/constants/permissions'
import AuthorizationHelper from '../../utils/AuthorizationHelper'
import ClientRepository from '../../data/repositories/ClientRepository'
import { UserClient } from '../../../foundation/models/UserClient'
import UserAccountRepository from '../../data/repositories/UserAccountRepository'

import { WhereAttributeHash, default as Sequelize } from 'sequelize'
import { IUserAccount } from '../../../foundation/types/types'
import { ScopeMap } from '../../../foundation/constants/scopes'

export interface IVerifyScopeResult {
  approvedScopes?: string[]
  pendingScopes?: string[]
  userClientId?: string
}

export async function getClientsForUser(userAccountId: string) {
  const userClients = await UserClient.findAll({
    where: {
      userAccountId: userAccountId,
      revoked: {
        [Sequelize.Op.ne]: true
      }
    }
  })

  const userClientIds = userClients.map((uc) => uc.client_id)
  return await ClientRepository.getClients({ client_id_in: userClientIds }, {})
}

class UserClientService {
  @hasPermission(Permissions.User)
  public async updateScopes(
    userAccount: IUserAccount,
    client_id: string,
    allowedScopes: string[],
    deniedScopes: string[],
    options: IQueryOptions
  ): Promise<void> {
    const client = await ClientRepository.getClient({ client_id }, options)
    if (!client) {
      throw new Error(`Unknown client: ${client_id}`)
    }
    const userClient = await UserClientRepository.getUserClient(
      { userAccountId: userAccount.userAccountId!, client_id },
      options
    )
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
      const newDeniedScopes = _.uniq(prevDeniedScopes.concat(deniedScopes)).filter(
        (denied) => !allowedScopes.includes(denied)
      )
      const newAllowedScopes = _.uniq(prevAllowedScopes.concat(allowedScopes)).filter(
        (allowed) => !newDeniedScopes.includes(allowed)
      )
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
