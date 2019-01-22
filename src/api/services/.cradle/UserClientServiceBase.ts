import { IUserClientMeta, IUserClientFilter, IUserClientUniqueFilter } from '@/interfaces/graphql/IUserClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { IUserClient } from '@data/models/IUserClient'
import { UserClientInstance } from '@data/models/UserClient'
import { AnyWhereOptions } from 'sequelize'
import { IServiceOptions } from '@services/IServiceOptions'

export default class UserClientServiceBase {
  protected async userClientsMeta(filter: IUserClientFilter | null, options: IServiceOptions): Promise<IUserClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().UserClient.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  protected async getUserClients(filter: IUserClientFilter | null, options: IServiceOptions): Promise<UserClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().UserClient.findAll({
      where,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async getUserClient(filter: IUserClientUniqueFilter, options: IServiceOptions): Promise<UserClientInstance | null> {
    return await getContext().UserClient.findOne({
      where: filter,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async createUserClient(data: IUserClient, options: IServiceOptions): Promise<UserClientInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await getContext().UserClient.create(data, { returning: true, raw: true, transaction: options.transaction })
  }

  protected async deleteUserClient(filter: IUserClientUniqueFilter, options: IServiceOptions): Promise<boolean> {
    const data: Partial<IUserClient> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await getContext().UserClient.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  protected async updateUserClient(filter: IUserClientUniqueFilter, data: Partial<IUserClient>, options: IServiceOptions): Promise<UserClientInstance | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await getContext().UserClient.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getUserClient(filter, options)
  }
}
