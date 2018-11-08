import { IUserClientMeta, IUserClientFilter, IUserClientUniqueFilter } from '@/interfaces/graphql/IUserClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IUserClient } from '@data/models/IUserClient'
import { UserClientInstance } from '@data/models/UserClient'
import { AnyWhereOptions } from 'sequelize'

export default class UserClientServiceBase {
  public async userClientsMeta(filter?: IUserClientFilter): Promise<IUserClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.UserClient.count({ where })
    return {
      count
    }
  }

  public async getUserClients(filter?: IUserClientFilter): Promise<UserClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserClient.findAll({
      where,
      raw: true
    })
  }

  public async getUserClient(filter: IUserClientUniqueFilter): Promise<UserClientInstance | null> {
    return await db.UserClient.findOne({
      where: filter,
      raw: true
    })
  }

  public async createUserClient(data: IUserClient): Promise<UserClientInstance> {
    return await db.UserClient.create(data, { returning: true, raw: true })
  }

  public async deleteUserClient(filter: IUserClientUniqueFilter): Promise<number> {
    return await db.UserClient.destroy({
      where: filter as AnyWhereOptions
    })
  }

  public async updateUserClient(filter: IUserClientUniqueFilter, data: IUserClient): Promise<UserClientInstance | null> {
    return await db.UserClient.update(data, {
      where: filter as AnyWhereOptions,
      returning: true
    }).then(() => this.getUserClient(filter))
  }
}
