import { IClientMeta, IClientFilter, IClientUniqueFilter } from '../../interfaces/graphql/IClient'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'
import { getContext } from '../../data/context'
import { Client } from '../../data/models/Client'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class ClientRepository {
  public async clientsMeta(filter: IClientFilter | null, options: IQueryOptions): Promise<IClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await Client.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getClients(filter: IClientFilter | null, options: IQueryOptions): Promise<Client[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await Client.findAll({
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
    return results
  }

  public async getClientsWithSensitiveData(filter: IClientFilter | null, options: IQueryOptions): Promise<Client[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await Client.findAll({
      where,

      transaction: options.transaction
    })

    return results
  }

  public async getClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<Client | null> {
    const result = await Client.findOne({
      where: filter as WhereAttributeHash,
      attributes: {
        exclude: ['secret']
      },

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async getClientWithSensitiveData(filter: IClientUniqueFilter, options: IQueryOptions): Promise<Client | null> {
    const result = await Client.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })

    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createClient(data: Client, options: IQueryOptions): Promise<Client> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await Client.create(data, { transaction: options.transaction })
  }

  public async deleteClient(filter: IClientUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<Client> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await Client.update(data, {
      where: filter as WhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateClient(
    filter: IClientUniqueFilter,
    data: Partial<Client>,
    options: IQueryOptions
  ): Promise<Client | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await Client.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getClient(filter, options)
  }
}

export default new ClientRepository()
