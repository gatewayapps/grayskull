import {
  IRefreshTokenMeta,
  IRefreshTokenFilter,
  IRefreshTokenUniqueFilter
} from '../../interfaces/graphql/IRefreshToken'
import { convertFilterToSequelizeWhere } from '../../utils/graphQLSequelizeConverter'

import { RefreshToken } from '../../../foundation/models/RefreshToken'

import { WhereOptions, WhereAttributeHash } from 'sequelize'
import { IQueryOptions } from '../../../foundation/models/IQueryOptions'

class RefreshTokenRepository {
  public async refreshTokensMeta(
    filter: IRefreshTokenFilter | null,
    options: IQueryOptions
  ): Promise<IRefreshTokenMeta> {
    const where = convertFilterToSequelizeWhere(filter)
    const count = await RefreshToken.count({ where, transaction: options.transaction })
    return {
      count
    }
  }

  public async getRefreshTokens(filter: IRefreshTokenFilter | null, options: IQueryOptions): Promise<RefreshToken[]> {
    const where = convertFilterToSequelizeWhere(filter)
    const results = await RefreshToken.findAll({
      where,
      include: options.include,
      order: options.order,
      limit: options.limit,
      offset: options.offset,

      transaction: options.transaction
    })
    return results
  }

  public async getRefreshToken(
    filter: IRefreshTokenUniqueFilter,
    options: IQueryOptions
  ): Promise<RefreshToken | null> {
    const result = await RefreshToken.findOne({
      where: filter as WhereAttributeHash,

      transaction: options.transaction
    })
    if (result) {
      return result
    } else {
      return null
    }
  }

  public async createRefreshToken(data: Partial<RefreshToken>, options: IQueryOptions): Promise<RefreshToken> {
    if (options.userContext) {
      data.createdBy = options.userContext.userAccountId
      data.updatedBy = options.userContext.userAccountId
    }
    return await RefreshToken.create(data, { transaction: options.transaction })
  }

  public async deleteRefreshToken(filter: IRefreshTokenUniqueFilter, options: IQueryOptions): Promise<boolean> {
    const data: Partial<RefreshToken> = {
      deletedAt: new Date()
    }
    if (options.userContext) {
      data.deletedBy = options.userContext.userAccountId
    }
    const [affectedCount] = await RefreshToken.update(data, {
      where: filter as WhereOptions,
      transaction: options.transaction
    })
    return affectedCount > 0
  }

  public async updateRefreshToken(
    filter: IRefreshTokenUniqueFilter,
    data: Partial<RefreshToken>,
    options: IQueryOptions
  ): Promise<RefreshToken | null> {
    if (options.userContext) {
      data.updatedBy = options.userContext.userAccountId
    }
    await RefreshToken.update(data, {
      where: filter as WhereOptions,

      transaction: options.transaction
    })
    return await this.getRefreshToken(filter, options)
  }
}

export default new RefreshTokenRepository()
