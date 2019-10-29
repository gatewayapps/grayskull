import { IClientMeta, IClientFilter, IClientUniqueFilter } from '@/interfaces/graphql/IClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IClient } from '@data/models/IClient'

import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '@data/IQueryOptions'

class ClientRepository {
  public async clientsMeta(filter: IClientFilter | null, options: IQueryOptions): Promise<IClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Client.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getClients(filter: IClientFilter | null, options: IQueryOptions): Promise<IClient[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.Client.findAll({
      where,
      attributes: {
        exclude: ['secret']
      },
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results.map((r) => r.toJSON())
  }

  public async getClientsWithSensitiveData(filter: IClientFilter | null, options: IQueryOptions): Promise<IClient[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.Client.findAll({
      where,

      transaction: options.transaction
    })

    return results.map((r) => r.toJSON())
  }

  public async getClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<IClient | null> {
    const result = await db.Client.findOne({
      where: filter,
      attributes: {
        exclude: ['secret']
      },

      transaction: options.transaction
    })
    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async getClientWithSensitiveData(filter: IClientUniqueFilter, options: IQueryOptions): Promise<IClient | null> {
    const result = await db.Client.findOne({
      where: filter,

      transaction: options.transaction
    })

    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async createClient(data: IClient, options: IQueryOptions): Promise<IClient> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.Client.create(data, { returning: true, transaction: options.transaction })
  }

  public async deleteClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<IClient> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await db.Client.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateClient(filter: IClientUniqueFilter, data: Partial<IClient>, options: IQueryOptions): Promise<IClient | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.Client.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getClient(filter, options)
  }
}

export default new ClientRepository()
