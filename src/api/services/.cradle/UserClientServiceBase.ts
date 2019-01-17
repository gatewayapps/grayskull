import { IUserClientMeta, IUserClientFilter, IUserClientUniqueFilter } from '@/interfaces/graphql/IUserClient'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { IUserClient } from '@data/models/IUserClient'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserClientInstance } from '@data/models/UserClient'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class UserClientServiceBase {
  public async userClientsMeta(filter?: IUserClientFilter, transaction?: Transaction): Promise<IUserClientMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().UserClient.count({ where, transaction })
    return {
      count
    }
  }

  public async getUserClients(filter?: IUserClientFilter, transaction?: Transaction): Promise<UserClientInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().UserClient.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getUserClient(filter: IUserClientUniqueFilter, transaction?: Transaction): Promise<UserClientInstance | null> {
    return await getContext().UserClient.findOne({
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
    return await getContext().UserClient.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteUserClient(filter: IUserClientUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const data: Partial<IUserClient> = {
      deletedAt: new Date()
    }
    if (userContext) {
      data.deletedBy = userContext.userAccountId
    }
    const [affectedCount] = await getContext().UserClient.update(data, {
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateUserClient(filter: IUserClientUniqueFilter, data: IUserClient, userContext?: IUserAccount, transaction?: Transaction): Promise<UserClientInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await getContext()
      .UserClient.update(data, {
        where: filter as AnyWhereOptions,
        returning: true,
        transaction
      })
      .then(() => this.getUserClient(filter))
  }
}
