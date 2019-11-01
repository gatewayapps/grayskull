import { ISessionFilter, ISessionMeta, ISessionUniqueFilter } from '../../interfaces/graphql/ISession'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'
import db from '../../data/context'
import { ISession } from '../../data/models/ISession'

import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class SessionRepository {
  public async sessionsMeta(filter: ISessionFilter | null, options: IQueryOptions): Promise<ISessionMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.Session.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getSessions(filter: ISessionFilter | null, options: IQueryOptions): Promise<ISession[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.Session.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results.map((r) => r.toJSON())
  }

  public async getSession(filter: ISessionUniqueFilter, options: IQueryOptions): Promise<ISession | null> {
    const result = await db.Session.findOne({
      where: filter,

      transaction: options.transaction
    })
    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async createSession(data: ISession, options: IQueryOptions): Promise<ISession> {
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

  public async updateSession(filter: ISessionUniqueFilter, data: Partial<ISession>, options: IQueryOptions): Promise<ISession | null> {
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
