import { IRefreshTokenMeta, IRefreshTokenFilter, IRefreshTokenUniqueFilter } from '@/interfaces/graphql/IRefreshToken'
import { convertFilterToSequelizeWhere } from '@/utils/graphQLSequelizeConverter'
import db from '@data/context'
import { IRefreshToken } from '@data/models/IRefreshToken'

import { AnyWhereOptions } from 'sequelize'
import { IQueryOptions } from '@data/IQueryOptions'

class RefreshTokenRepository {
  public async refreshTokensMeta(filter: IRefreshTokenFilter | null, options: IQueryOptions): Promise<IRefreshTokenMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await db.RefreshToken.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getRefreshTokens(filter: IRefreshTokenFilter | null, options: IQueryOptions): Promise<IRefreshToken[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await db.RefreshToken.findAll({
      where,

      transaction: options.transaction
    })
    return results.map((r) => r.toJSON())
  }

  public async getRefreshToken(filter: IRefreshTokenUniqueFilter, options: IQueryOptions): Promise<IRefreshToken | null> {
    const result = await db.RefreshToken.findOne({
      where: filter,

      transaction: options.transaction
    })
    if (result) {
      return result.toJSON()
    } else {
      return null
    }
  }

  public async createRefreshToken(data: IRefreshToken, options: IQueryOptions): Promise<IRefreshToken> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await db.RefreshToken.create(data, { returning: true, transaction: options.transaction })
  }

  public async deleteRefreshToken(filter: IRefreshTokenUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<IRefreshToken> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await db.RefreshToken.update(data, {
      where: filter as AnyWhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateRefreshToken(filter: IRefreshTokenUniqueFilter, data: Partial<IRefreshToken>, options: IQueryOptions): Promise<IRefreshToken | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await db.RefreshToken.update(data, {
      where: filter as AnyWhereOptions,
      returning: true,
      transaction: options.transaction
    })
    return await this.getRefreshToken(filter, options)
  }
}

export default new RefreshTokenRepository()
