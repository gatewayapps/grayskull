import { IClientMeta, IClientFilter, IClientUniqueFilter } from '@/interfaces/graphql/IClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { IClient } from '@data/models/IClient'
import { ClientInstance } from '@data/models/Client'
import { AnyWhereOptions } from 'sequelize'
import { IServiceOptions } from '@services/IServiceOptions'

export default class ClientServiceBase {
  protected async clientsMeta(filter: IClientFilter | null, options: IServiceOptions): Promise<IClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().Client.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  protected async getClients(filter: IClientFilter | null, options: IServiceOptions): Promise<ClientInstance[]> {
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

  protected async getClientsWithSensitiveData(filter: IClientFilter | null, options: IServiceOptions): Promise<ClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().Client.findAll({
      where,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async getClient(filter: IClientUniqueFilter, options: IServiceOptions): Promise<ClientInstance | null> {
    return await getContext().Client.findOne({
      where: filter,
      attributes: {
        exclude: ['secret']
      },
      raw: true,
      transaction: options.transaction
    })
  }

  protected async getClientWithSensitiveData(filter: IClientUniqueFilter, options: IServiceOptions): Promise<ClientInstance | null> {
    return await getContext().Client.findOne({
      where: filter,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async createClient(data: IClient, options: IServiceOptions): Promise<ClientInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await getContext().Client.create(data, { returning: true, raw: true, transaction: options.transaction })
  }

  protected async deleteClient(filter: IClientUniqueFilter, options: IServiceOptions): Promise<boolean> {
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

  protected async updateClient(filter: IClientUniqueFilter, data: Partial<IClient>, options: IServiceOptions): Promise<ClientInstance | null> {
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
