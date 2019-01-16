import { IClientMeta, IClientFilter, IClientUniqueFilter } from '@/interfaces/graphql/IClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IClient } from '@data/models/IClient'
import { IUserAccount } from '@data/models/IUserAccount'
import { ClientInstance } from '@data/models/Client'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class ClientServiceBase {
  public async clientsMeta(filter?: IClientFilter, transaction?: Transaction): Promise<IClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Client.count({ where, transaction })
    return {
      count
    }
  }

  public async getClients(filter?: IClientFilter, transaction?: Transaction): Promise<ClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.Client.findAll({
      where,
      attributes: {
        exclude: ['secret']
      },
      raw: true,
      transaction
    })
  }

  public async getClientsWithSensitiveData(filter?: IClientFilter, transaction?: Transaction): Promise<ClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.Client.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getClient(filter: IClientUniqueFilter, transaction?: Transaction): Promise<ClientInstance | null> {
    return await db.Client.findOne({
      where: filter,
      attributes: {
        exclude: ['secret']
      },
      raw: true,
      transaction
    })
  }

  public async getClientWithSensitiveData(filter: IClientUniqueFilter, transaction?: Transaction): Promise<ClientInstance | null> {
    return await db.Client.findOne({
      where: filter,
      raw: true,
      transaction
    })
  }

  public async createClient(data: IClient, userContext?: IUserAccount, transaction?: Transaction): Promise<ClientInstance> {
    if (userContext) {
      data.createdBy = userContext.userAccountId
      data.updatedBy = userContext.userAccountId
    }
    return await db.Client.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteClient(filter: IClientUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const data: Partial<IClient> = {
      deletedAt: new Date()
    }
    if (userContext) {
      data.deletedBy = userContext.userAccountId
    }
    const [affectedCount] = await db.Client.update(data, {
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateClient(filter: IClientUniqueFilter, data: Partial<IClient>, userContext?: IUserAccount, transaction?: Transaction): Promise<ClientInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await db.Client.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction
    }).then(() => this.getClient(filter))
  }
}
