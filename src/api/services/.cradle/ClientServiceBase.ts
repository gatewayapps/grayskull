import { IClientMeta, IClientFilter, IClientUniqueFilter } from '@/interfaces/graphql/IClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IClient } from '@data/models/IClient'
import { ClientInstance } from '@data/models/Client'
import { AnyWhereOptions } from 'sequelize'

export default class ClientServiceBase {
  public async clientsMeta(filter?: IClientFilter): Promise<IClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Client.count({ where })
    return {
      count
    }
  }

  public async getClients(filter?: IClientFilter): Promise<ClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.Client.findAll({
      where,
      attributes: {
        exclude: ['secret']
      },
      raw: true
    })
  }

  public async getClientsWithSensitiveData(filter?: IClientFilter): Promise<ClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.Client.findAll({
      where,
      raw: true
    })
  }

  public async getClient(filter: IClientUniqueFilter): Promise<ClientInstance | null> {
    return await db.Client.findOne({
      where: filter,
      attributes: {
        exclude: ['secret']
      },
      raw: true
    })
  }

  public async getClientWithSensitiveData(filter: IClientUniqueFilter): Promise<ClientInstance | null> {
    return await db.Client.findOne({
      where: filter,
      raw: true
    })
  }

  public async createClient(data: IClient): Promise<ClientInstance> {
    return await db.Client.create(data, { returning: true, raw: true })
  }

  public async deleteClient(filter: IClientUniqueFilter): Promise<number> {
    return await db.Client.destroy({
      where: filter as AnyWhereOptions
    })
  }

  public async updateClient(filter: IClientUniqueFilter, data: IClient): Promise<ClientInstance | null> {
    return await db.Client.update(data, {
      where: filter as AnyWhereOptions,
      returning: true
    }).then(() => this.getClient(filter))
  }
}
