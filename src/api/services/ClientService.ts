import { ClientInstance } from '@data/models/Client'
import { IClient } from '@data/models/IClient'
import { IUserAccount } from '@data/models/IUserAccount'

import crypto from 'crypto'
import uuid from 'uuid/v4'
import { IClientFilter, IClientUniqueFilter, IClientMeta } from '@/interfaces/graphql/IClient'
import { Transaction } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { hasPermission } from '@decorators/permissionDecorator'
import { Permissions } from '@/utils/permissions'
import ClientRepository from '@data/repositories/ClientRepository'

class ClientService {
  @hasPermission(Permissions.Admin)
  public async createClient(data: IClient, options: IQueryOptions): Promise<ClientInstance> {
    if (!data.client_id) {
      data.client_id = uuid()
    }
    if (!data.secret) {
      data.secret = crypto.randomBytes(128).toString('hex')
    }
    const client = await ClientRepository.createClient(data, options)
    return client
  }

  @hasPermission(Permissions.Admin)
  public async clientsMeta(filter: IClientFilter | null, options: IQueryOptions): Promise<IClientMeta> {
    return ClientRepository.clientsMeta(filter, options)
  }

  public async getPublicClients(filter: IClientFilter | null, options: IQueryOptions) {
    if (filter) {
      filter.public_equals = true
    } else {
      filter = { public_equals: true }
    }
    return ClientRepository.getClients(filter, options)
  }

  @hasPermission(Permissions.Admin)
  public async getClients(filter: IClientFilter | null, options: IQueryOptions): Promise<ClientInstance[]> {
    return ClientRepository.getClients(filter, options)
  }
  public async getClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<ClientInstance | null> {
    return ClientRepository.getClient(filter, options)
  }

  public async validateClient(client_id: string, secret: string, options: IQueryOptions): Promise<ClientInstance | null> {
    const client = await ClientRepository.getClientWithSensitiveData({ client_id }, options)
    if (client && client.secret === secret) {
      return client
    }
    return null
  }
  @hasPermission(Permissions.Admin)
  public async updateClient(filter: IClientUniqueFilter, data: Partial<IClient>, options: IQueryOptions): Promise<ClientInstance | null> {
    return ClientRepository.updateClient(filter, data, options)
  }
}

export default new ClientService()
