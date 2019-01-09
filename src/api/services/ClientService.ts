import { ClientInstance } from '@data/models/Client'
import { IClient } from '@data/models/IClient'
import { IUserAccount } from '@data/models/IUserAccount'
import ClientServiceBase from '@services/ClientServiceBase'
import UserAccountService from '@services/UserAccountService'
import UserClientService from '@services/UserClientService'
import crypto from 'crypto'
import uuid from 'uuid/v4'
import { IClientFilter } from '@/interfaces/graphql/IClient'

class ClientService extends ClientServiceBase {
  public async createClient(data: IClient, userContext?: IUserAccount): Promise<ClientInstance> {
    if (!data.client_id) {
      data.client_id = uuid()
    }
    if (!data.secret) {
      data.secret = crypto.randomBytes(32).toString('hex')
    }
    if (userContext) {
      data.createdBy = userContext.userAccountId
      data.modifiedBy = userContext.userAccountId
    }
    const client = await super.createClient(data)
    if (userContext) {
      await UserClientService.createUserClient({
        client_id: client.client_id,
        userAccountId: userContext.userAccountId!,
        createdBy: userContext.userAccountId!
      })
    }
    return client
  }

  public async getPublicClients(filter?: IClientFilter) {
    if (filter) {
      filter.public_equals = true
    } else {
      filter = { public_equals: true }
    }
    return super.getClients(filter)
  }

  public async validateClient(client_id: string, secret: string): Promise<ClientInstance | null> {
    const client = await super.getClientWithSensitiveData({ client_id })
    if (client && client.secret === secret) {
      return client
    }
    return null
  }
}

export default new ClientService()
