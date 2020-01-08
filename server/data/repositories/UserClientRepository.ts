import { IUserClientMeta, IUserClientFilter, IUserClientUniqueFilter } from '../../interfaces/graphql/IUserClient'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'

import { UserClient } from '../../data/models/UserClient'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class UserClientRepository {
  public async userClientsMeta(filter: IUserClientFilter | null, options: IQueryOptions): Promise<IUserClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await UserClient.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getUserClients(filter: IUserClientFilter | null, options: IQueryOptions): Promise<UserClient[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await UserClient.findAll({
      where,

      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results
  }

  public async getUserClient(filter: WhereAttributeHash, options: IQueryOptions): Promise<UserClient | null> {
    const result = await UserClient.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createUserClient(data: Partial<UserClient>, options: IQueryOptions): Promise<UserClient> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await UserClient.create(data, { transaction: options.transaction })
  }

  public async deleteUserClient(filter: IUserClientUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<UserClient> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await UserClient.update(data, {
      where: filter as WhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateUserClient(
    filter: WhereAttributeHash,
    data: Partial<UserClient>,
    options: IQueryOptions
  ): Promise<UserClient | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await UserClient.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getUserClient(filter, options)
  }
}

export default new UserClientRepository()
