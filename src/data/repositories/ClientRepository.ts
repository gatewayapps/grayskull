import { IClientMeta, IClientFilter, IClientUniqueFilter } from '@/interfaces/graphql/IClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { IClient } from '@data/models/IClient'
import { ClientInstance } from '@data/models/Client'
import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '@data/IQueryOptions'

class ClientRepository {
  public async clientsMeta(filter: IClientFilter | null, options: IQueryOptions): Promise<IClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().Client.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getClients(filter: IClientFilter | null, options: IQueryOptions): Promise<ClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().Client.findAll({
      where,
      attributes: {
        exclude: ['secret']
      },
      raw: true,
      transaction: options.transaction
    })
  }

  public async getClientsWithSensitiveData(filter: IClientFilter | null, options: IQueryOptions): Promise<ClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().Client.findAll({
      where,
      raw: true,
      transaction: options.transaction
    })
  }

  public async getClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<ClientInstance | null> {
    return await getContext().Client.findOne({
      where: filter,
      attributes: {
        exclude: ['secret']
      },
      raw: true,
      transaction: options.transaction
    })
  }

  public async getClientWithSensitiveData(filter: IClientUniqueFilter, options: IQueryOptions): Promise<ClientInstance | null> {
    return await getContext().Client.findOne({
      where: filter,
      raw: true,
      transaction: options.transaction
    })
  }

  public async createClient(data: IClient, options: IQueryOptions): Promise<ClientInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await getContext().Client.create(data, { returning: true, raw: true, transaction: options.transaction })
  }

  public async deleteClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<IClient> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await getContext().Client.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateClient(filter: IClientUniqueFilter, data: Partial<IClient>, options: IQueryOptions): Promise<ClientInstance | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await getContext().Client.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getClient(filter, options)
  }
}

export default new ClientRepository()
