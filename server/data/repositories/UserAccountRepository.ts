import { IUserAccountMeta, IUserAccountFilter, IUserAccountUniqueFilter } from '@/interfaces/graphql/IUserAccount'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IUserAccount } from '@data/models/IUserAccount'

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

  public async getUserAccounts(filter: IUserAccountFilter | null, options: IQueryOptions): Promise<IUserAccount[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.UserAccount.findAll({
      where,
      attributes: {
        exclude: ['passwordHash', 'otpSecret', 'resetPasswordToken', 'resetPasswordTokenExpiresAt']
      },
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results.map((r) => r.toJSON())
  }

  public async getUserAccountsWithSensitiveData(filter: IUserAccountFilter | null, options: IQueryOptions): Promise<IUserAccount[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.UserAccount.findAll({
      where,

      transaction: options.transaction
    })

    return results.map((r) => r.toJSON())
  }

  public async getUserAccount(filter: IUserAccountUniqueFilter, options: IQueryOptions): Promise<IUserAccount | null> {
    const result = await db.UserAccount.findOne({
      where: filter,
      attributes: {
        exclude: ['passwordHash', 'otpSecret', 'resetPasswordToken', 'resetPasswordTokenExpiresAt']
      },

      transaction: options.transaction
    })
    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async getUserAccountWithSensitiveData(filter: IUserAccountUniqueFilter, options: IQueryOptions): Promise<IUserAccount | null> {
    const result = await db.UserAccount.findOne({
      where: filter,

      transaction: options.transaction
    })

    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async createUserAccount(data: IUserAccount, options: IQueryOptions): Promise<IUserAccount> {
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

  public async updateUserAccount(filter: IUserAccountUniqueFilter, data: Partial<IUserAccount>, options: IQueryOptions): Promise<IUserAccount | null> {
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
