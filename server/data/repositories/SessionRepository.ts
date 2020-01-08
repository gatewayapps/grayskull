import { SessionMeta, SessionFilter, SessionUniqueFilter } from '../../interfaces/graphql/ISession'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'

import { Session } from '../../data/models/Session'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'

class SessionRepository {
  public async sessionsMeta(filter: SessionFilter | null, options: IQueryOptions): Promise<SessionMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await Session.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getSessions(filter: SessionFilter | null, options: IQueryOptions): Promise<Session[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await Session.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results
  }

  public async getSession(filter: SessionUniqueFilter, options: IQueryOptions): Promise<Session | null> {
    const result = await Session.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createSession(data: Partial<Session>, options: IQueryOptions): Promise<Session> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await Session.create(data, { transaction: options.transaction })
  }

  public async deleteSession(filter: SessionUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const affectedCount = await Session.destroy({
      where: filter as WhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateSession(
    filter: SessionUniqueFilter,
    data: Partial<Session>,
    options: IQueryOptions
  ): Promise<Session | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await Session.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getSession(filter, options)
  }
}

export default new SessionRepository()
