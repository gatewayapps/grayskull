import { ClientInstance } from '@data/models/Client'
import { IClient } from '@data/models/IClient'
import { IUserAccount } from '@data/models/IUserAccount'
import ClientServiceBase from '@services/.cradle/ClientServiceBase'
import crypto from 'crypto'
import uuid from 'uuid/v4'
import { IClientFilter, IClientUniqueFilter, IClientMeta } from '@/interfaces/graphql/IClient'
import { Transaction } from 'sequelize'
import { IServiceOptions } from './IServiceOptions'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'

class ClientService extends ClientServiceBase {
  //TODO: Must be admin
  public async createClient(data: IClient, options: IServiceOptions): Promise<ClientInstance> {
    if (!data.client_id) {
      data.client_id = uuid()
    }
    if (!data.secret) {
      data.secret = crypto.randomBytes(32).toString('hex')
    }
    const client = await super.createClient(data, options)
    return client
  }
  //TODO: Must be admin
  public async clientsMeta(filter: IClientFilter | null, options: IServiceOptions): Promise<IClientMeta> {
    return super.clientsMeta(filter, options)
  }

  public async getPublicClients(filter: IClientFilter | null, options: IServiceOptions) {
    if (filter) {
      filter.public_equals = true
    } else {
      filter = { public_equals: true }
    }
    return super.getClients(filter, options)
  }

  //TODO: Must be admin
  public async getClients(filter: IClientFilter | null, options: IServiceOptions): Promise<ClientInstance[]> {
    return super.getClients(filter, options)
  }
  public async getClient(filter: IClientUniqueFilter, options: IServiceOptions): Promise<ClientInstance | null> {
    return super.getClient(filter, options)
  }
  //TODO: Must be admin
  public async validateClient(client_id: string, secret: string, options: IServiceOptions): Promise<ClientInstance | null> {
    const client = await super.getClientWithSensitiveData({ client_id }, options)
    if (client && client.secret === secret) {
      return client
    }
    return null
  }
  //TODO: Must be admin
  public async updateClient(filter: IClientUniqueFilter, data: Partial<IClient>, options: IServiceOptions): Promise<ClientInstance | null> {
    return super.updateClient(filter, data, options)
  }
}

export default new ClientService()
