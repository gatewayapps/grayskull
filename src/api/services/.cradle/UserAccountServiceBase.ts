import { IUserAccountMeta, IUserAccountFilter, IUserAccountUniqueFilter } from '@/interfaces/graphql/IUserAccount'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import { AnyWhereOptions } from 'sequelize'

export default class UserAccountServiceBase {
  public async userAccountsMeta(filter?: IUserAccountFilter): Promise<IUserAccountMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.UserAccount.count({ where })
    return {
      count
    }
  }

  public async getUserAccounts(filter?: IUserAccountFilter): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserAccount.findAll({
      where,
      attributes: {
        exclude: ['passwordHash']
      },
      raw: true
    })
  }

  public async getUserAccountsWithSensitiveData(filter?: IUserAccountFilter): Promise<UserAccountInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.UserAccount.findAll({
      where,
      raw: true
    })
  }

  public async getUserAccount(filter: IUserAccountUniqueFilter): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: filter,
      attributes: {
        exclude: ['passwordHash']
      },
      raw: true
    })
  }

  public async getUserAccountWithSensitiveData(filter: IUserAccountUniqueFilter): Promise<UserAccountInstance | null> {
    return await db.UserAccount.findOne({
      where: filter,
      raw: true
    })
  }

  public async createUserAccount(data: IUserAccount): Promise<UserAccountInstance> {
    return await db.UserAccount.create(data, { returning: true, raw: true })
  }

  public async deleteUserAccount(filter: IUserAccountUniqueFilter): Promise<number> {
    return await db.UserAccount.destroy({
      where: filter as AnyWhereOptions
    })
  }

  public async updateUserAccount(filter: IUserAccountUniqueFilter, data: IUserAccount): Promise<UserAccountInstance | null> {
    return await db.UserAccount.update(data, {
      where: filter as AnyWhereOptions,
      returning: true
    }).then(() => this.getUserAccount(filter))
  }
}
