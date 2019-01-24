import { IUserAccountMeta, IUserAccountFilter, IUserAccountUniqueFilter } from '@/interfaces/graphql/IUserAccount'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '@data/IQueryOptions'

class UserAccountRepository {
  public async userAccountsMeta(filter: IUserAccountFilter | null, options: IQueryOptions): Promise<IUserAccountMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.UserAccount.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getUserAccounts(filter: IUserAccountFilter | null, options: IQueryOptions): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserAccount.findAll({
      where,
      attributes: {
        exclude: ['passwordHash', 'otpSecret']
      },

      transaction: options.transaction
    })
  }

  public async getUserAccountsWithSensitiveData(filter: IUserAccountFilter | null, options: IQueryOptions): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserAccount.findAll({
      where,

      transaction: options.transaction
    })
  }

  public async getUserAccount(filter: IUserAccountUniqueFilter, options: IQueryOptions): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: filter,
      attributes: {
        exclude: ['passwordHash', 'otpSecret']
      },

      transaction: options.transaction
    })
  }

  public async getUserAccountWithSensitiveData(filter: IUserAccountUniqueFilter, options: IQueryOptions): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: filter,

      transaction: options.transaction
    })
  }

  public async createUserAccount(data: IUserAccount, options: IQueryOptions): Promise<UserAccountInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.UserAccount.create(data, { returning: true, transaction: options.transaction })
  }

  public async deleteUserAccount(filter: IUserAccountUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<IUserAccount> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await db.UserAccount.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateUserAccount(filter: IUserAccountUniqueFilter, data: Partial<IUserAccount>, options: IQueryOptions): Promise<UserAccountInstance | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.UserAccount.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getUserAccount(filter, options)
  }
}

export default new UserAccountRepository()
