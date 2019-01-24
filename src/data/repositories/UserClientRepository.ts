import { IUserClientMeta, IUserClientFilter, IUserClientUniqueFilter } from '@/interfaces/graphql/IUserClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IUserClient } from '@data/models/IUserClient'
import { UserClientInstance } from '@data/models/UserClient'
import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '@data/IQueryOptions'

class UserClientRepository {
  public async userClientsMeta(filter: IUserClientFilter | null, options: IQueryOptions): Promise<IUserClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.UserClient.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getUserClients(filter: IUserClientFilter | null, options: IQueryOptions): Promise<UserClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserClient.findAll({
      where,

      transaction: options.transaction
    })
  }

  public async getUserClient(filter: IUserClientUniqueFilter, options: IQueryOptions): Promise<UserClientInstance | null> {
    return await db.UserClient.findOne({
      where: filter,

      transaction: options.transaction
    })
  }

  public async createUserClient(data: IUserClient, options: IQueryOptions): Promise<UserClientInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.UserClient.create(data, { returning: true, transaction: options.transaction })
  }

  public async deleteUserClient(filter: IUserClientUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<IUserClient> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await db.UserClient.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateUserClient(filter: IUserClientUniqueFilter, data: Partial<IUserClient>, options: IQueryOptions): Promise<UserClientInstance | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.UserClient.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getUserClient(filter, options)
  }
}

export default new UserClientRepository()
