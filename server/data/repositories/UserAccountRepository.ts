import { UserAccountMeta, UserAccountFilter, UserAccountUniqueFilter } from '../../interfaces/graphql/IUserAccount'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'

import { UserAccount } from '../../data/models/IUserAccount'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class UserAccountRepository {
  public async userAccountsMeta(filter: UserAccountFilter | null, options: IQueryOptions): Promise<UserAccountMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await UserAccount.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getUserAccounts(filter: UserAccountFilter | null, options: IQueryOptions): Promise<UserAccount[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await UserAccount.findAll({
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
    return results
  }

  public async getUserAccountsWithSensitiveData(
    filter: UserAccountFilter | null,
    options: IQueryOptions
  ): Promise<UserAccount[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await UserAccount.findAll({
      where,

      transaction: options.transaction
    })

    return results
  }

  public async getUserAccount(filter: UserAccountUniqueFilter, options: IQueryOptions): Promise<UserAccount | null> {
    const result = await UserAccount.findOne({
      where: filter as WhereAttributeHash,
      attributes: {
        exclude: ['passwordHash', 'otpSecret', 'resetPasswordToken', 'resetPasswordTokenExpiresAt']
      },

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async getUserAccountWithSensitiveData(
    filter: UserAccountUniqueFilter,
    options: IQueryOptions
  ): Promise<UserAccount | null> {
    const result = await UserAccount.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })

    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createUserAccount(data: UserAccount, options: IQueryOptions): Promise<UserAccount> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await UserAccount.create(data, { transaction: options.transaction })
  }

  public async deleteUserAccount(filter: UserAccountUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<UserAccount> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await UserAccount.update(data, {
      where: filter as WhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateUserAccount(
    filter: UserAccountUniqueFilter,
    data: Partial<UserAccount>,
    options: IQueryOptions
  ): Promise<UserAccount | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await UserAccount.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getUserAccount(filter, options)
  }
}

export default new UserAccountRepository()
