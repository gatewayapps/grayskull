import { ISessionMeta, ISessionFilter, ISessionUniqueFilter } from '@/interfaces/graphql/ISession'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import { getContext } from '@data/context'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import { SessionInstance } from '@data/models/Session'
import { AnyWhereOptions, Transaction } from 'sequelize'

export default class SessionServiceBase {
  public async sessionsMeta(filter?: ISessionFilter, transaction?: Transaction): Promise<ISessionMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await getContext().Session.count({ where, transaction })
    return {
      count
    }
  }

  public async getSessions(filter?: ISessionFilter, transaction?: Transaction): Promise<SessionInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await getContext().Session.findAll({
      where,
      raw: true,
      transaction
    })
  }

  public async getSession(filter: ISessionUniqueFilter, transaction?: Transaction): Promise<SessionInstance | null> {
    return await getContext().Session.findOne({
      where: filter,
      raw: true,
      transaction
    })
  }

  public async createSession(data: ISession, userContext?: IUserAccount, transaction?: Transaction): Promise<SessionInstance> {
    if (userContext) {
      data.createdBy = userContext.userAccountId
      data.updatedBy = userContext.userAccountId
    }
    return await getContext().Session.create(data, { returning: true, raw: true, transaction })
  }

  public async deleteSession(filter: ISessionUniqueFilter, userContext?: IUserAccount, transaction?: Transaction): Promise<boolean> {
    const affectedCount = await getContext().Session.destroy({
      where: filter as AnyWhereOptions,
      transaction
    })
    return affectedCount > 0
  }

  public async updateSession(filter: ISessionUniqueFilter, data: Partial<ISession>, userContext?: IUserAccount, transaction?: Transaction): Promise<SessionInstance | null> {
    if (userContext) {
      data.updatedBy = userContext.userAccountId
    }
    return await getContext()
      .Session.update(data, {
        where: filter as AnyWhereOptions,
        returning: true,
        transaction
      })
      .then(() => this.getSession(filter))
  }
}
