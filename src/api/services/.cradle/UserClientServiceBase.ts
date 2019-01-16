import { IUserClientMeta, IUserClientFilter, IUserClientUniqueFilter } from '@/interfaces/graphql/IUserClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IUserClient } from '@data/models/IUserClient'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserClientInstance } from '@data/models/UserClient'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class UserClientServiceBase {
  public async userClientsMeta(filter?: IUserClientFilter, transaction?: Transaction): Promise<IUserClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.UserClient.count({ where, transaction })
    return {
      count
    }
  }

  public async getUserClients(filter?: IUserClientFilter, transaction?: Transaction): Promise<UserClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserClient.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getUserClient(filter: IUserClientUniqueFilter, transaction?: Transaction): Promise<UserClientInstance | null> {
    return await db.UserClient.findOne({
      where: filter,
      raw: true,
      transaction
    })
  }

  public async createUserClient(data: IUserClient, userContext?: IUserAccount, transaction?: Transaction): Promise<UserClientInstance> {
    if (userContext) {
      data.createdBy = userContext.userAccountId
      data.updatedBy = userContext.userAccountId
    }
    return await db.UserClient.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteUserClient(filter: IUserClientUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const data: Partial<IUserClient> = {
      deletedAt: new Date()
    }
    if (userContext) {
      data.deletedBy = userContext.userAccountId
    }
    const [affectedCount] = await db.UserClient.update(data, {
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateUserClient(filter: IUserClientUniqueFilter, data: Partial<IUserClient>, userContext?: IUserAccount, transaction?: Transaction): Promise<UserClientInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await db.UserClient.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction
    }).then(() => this.getUserClient(filter))
  }
}
