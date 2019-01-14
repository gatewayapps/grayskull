import { IUserAccountMeta, IUserAccountFilter, IUserAccountUniqueFilter } from '@/interfaces/graphql/IUserAccount'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class UserAccountServiceBase {
  public async userAccountsMeta(filter?: IUserAccountFilter, transaction?: Transaction): Promise<IUserAccountMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.UserAccount.count({ where, transaction })
    return {
      count
    }
  }

  public async getUserAccounts(filter?: IUserAccountFilter, transaction?: Transaction): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserAccount.findAll({
      where,
      attributes: {
        exclude: ['passwordHash', 'otpSecret']
      },
      raw: true,
      transaction
    })
  }

  public async getUserAccountsWithSensitiveData(filter?: IUserAccountFilter, transaction?: Transaction): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserAccount.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getUserAccount(filter: IUserAccountUniqueFilter, transaction?: Transaction): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: filter,
      attributes: {
        exclude: ['passwordHash', 'otpSecret']
      },
      raw: true,
      transaction
    })
  }

  public async getUserAccountWithSensitiveData(filter: IUserAccountUniqueFilter, transaction?: Transaction): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: filter,
      raw: true,
      transaction
    })
  }

  public async createUserAccount(data: IUserAccount, userContext?: IUserAccount, transaction?: Transaction): Promise<UserAccountInstance> {
    if (userContext) {
      data.createdBy = userContext.userAccountId
      data.updatedBy = userContext.userAccountId
    }
    return await db.UserAccount.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteUserAccount(filter: IUserAccountUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const data: Partial<IUserAccount> = {
      deletedAt: new Date()
    }
    if (userContext) {
      data.deletedBy = userContext.userAccountId
    }
    const [affectedCount] = await db.UserAccount.update(data, {
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateUserAccount(filter: IUserAccountUniqueFilter, data: IUserAccount, userContext?: IUserAccount, transaction?: Transaction): Promise<UserAccountInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await db.UserAccount.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction
    }).then(() => this.getUserAccount(filter))
  }
}
