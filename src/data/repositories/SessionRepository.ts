import { ISessionMeta, ISessionFilter, ISessionUniqueFilter } from '@/interfaces/graphql/ISession'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { ISession } from '@data/models/ISession'
import { SessionInstance } from '@data/models/Session'
import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '@data/IQueryOptions'

class SessionRepository {
  public async sessionsMeta(filter: ISessionFilter | null, options: IQueryOptions): Promise<ISessionMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Session.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getSessions(filter: ISessionFilter | null, options: IQueryOptions): Promise<SessionInstance[]> {
    const where = convertFilterToSequelizeWhere(filter)
    return await db.Session.findAll({
      where,

      transaction: options.transaction
    })
  }

  public async getSession(filter: ISessionUniqueFilter, options: IQueryOptions): Promise<SessionInstance | null> {
    return await db.Session.findOne({
      where: filter,

      transaction: options.transaction
    })
  }

  public async createSession(data: ISession, options: IQueryOptions): Promise<SessionInstance> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.Session.create(data, { returning: true, transaction: options.transaction })
  }

  public async deleteSession(filter: ISessionUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const affectedCount = await db.Session.destroy({
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateSession(filter: ISessionUniqueFilter, data: Partial<ISession>, options: IQueryOptions): Promise<SessionInstance | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.Session.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getSession(filter, options)
  }
}

export default new SessionRepository()
