import { IUserAccountMeta, IUserAccountFilter, IUserAccountUniqueFilter } from '@/interfaces/graphql/IUserAccount'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import { AnyWhereOptions } from 'sequelize'
import { IServiceOptions } from '@services/IServiceOptions'

export default class UserAccountServiceBase {
  protected async userAccountsMeta(filter: IUserAccountFilter | null, options: IServiceOptions): Promise<IUserAccountMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().UserAccount.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  protected async getUserAccounts(filter: IUserAccountFilter | null, options: IServiceOptions): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().UserAccount.findAll({
      where,
      attributes: {
        exclude: ['passwordHash', 'otpSecret']
      },
      raw: true,
      transaction: options.transaction
    })
  }

  protected async getUserAccountsWithSensitiveData(filter: IUserAccountFilter | null, options: IServiceOptions): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().UserAccount.findAll({
      where,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async getUserAccount(filter: IUserAccountUniqueFilter, options: IServiceOptions): Promise<UserAccountInstance | null> {
    return await getContext().UserAccount.findOne({
      where: filter,
      attributes: {
        exclude: ['passwordHash', 'otpSecret']
      },
      raw: true,
      transaction: options.transaction
    })
  }

  protected async getUserAccountWithSensitiveData(filter: IUserAccountUniqueFilter, options: IServiceOptions): Promise<UserAccountInstance | null> {
    return await getContext().UserAccount.findOne({
      where: filter,
      raw: true,
      transaction: options.transaction
    })
  }

  protected async createUserAccount(data: IUserAccount, options: IServiceOptions): Promise<UserAccountInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await getContext().UserAccount.create(data, { returning: true, raw: true, transaction: options.transaction })
  }

  protected async deleteUserAccount(filter: IUserAccountUniqueFilter, options: IServiceOptions): Promise<boolean> {
    const data: Partial<IUserAccount> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await getContext().UserAccount.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  protected async updateUserAccount(filter: IUserAccountUniqueFilter, data: Partial<IUserAccount>, options: IServiceOptions): Promise<UserAccountInstance | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await getContext().UserAccount.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getUserAccount(filter, options)
  }
}
