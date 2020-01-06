import { Client } from '../../data/models/Client'

import crypto from 'crypto'
import uuid from 'uuid/v4'
import { IClientFilter, IClientMeta, IClientUniqueFilter } from '../../interfaces/graphql/IClient'

import { IQueryOptions } from '../../data/IQueryOptions'

import { hasPermission } from '../../decorators/permissionDecorator'
import { Permissions } from '../../utils/permissions'
import ClientRepository from '../../data/repositories/ClientRepository'

class ClientService {
  @hasPermission(Permissions.Admin)
  public async createClient(data: Client, options: IQueryOptions): Promise<Client> {
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
  public async getClients(filter: IClientFilter | null, options: IQueryOptions): Promise<Client[]> {
    return ClientRepository.getClients(filter, options)
  }
  public async getClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<Client | null> {
    return ClientRepository.getClient(filter, options)
  }

  public async validateClient(client_id: string, secret: string, options: IQueryOptions): Promise<Client | null> {
    const client = await ClientRepository.getClientWithSensitiveData({ client_id }, options)
    if (client && client.secret === secret) {
      return client
    }
    return null
  }
  @hasPermission(Permissions.Admin)
  public async updateClient(
    filter: IClientUniqueFilter,
    data: Partial<Client>,
    options: IQueryOptions
  ): Promise<Client | null> {
    return ClientRepository.updateClient(filter, data, options)
  }
}

export default new ClientService()
