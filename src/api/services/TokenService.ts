import { IUserAccount } from '@data/models/IUserAccount'
import { RefreshTokenInstance } from '@data/models/RefreshToken'
import bcrypt from 'bcrypt'
import moment from 'moment'
import { Transaction } from 'sequelize'
import { IQueryOptions } from '@/data/IQueryOptions'
import { IRefreshTokenUniqueFilter } from '@/interfaces/graphql/IRefreshToken'
import RefreshTokenRepository from '@/data/repositories/RefreshTokenRepository'
import { IClient } from '@data/models/IClient'
import { IRefreshToken } from '@data/models/IRefreshToken'
import { default as crypto, randomBytes } from 'crypto'
import UserClientRepository from '@data/repositories/UserClientRepository'
import { ScopeMap } from '@/api/services/ScopeService'
import UserClientService from './UserClientService'
import { ForbiddenError } from 'apollo-server'
import ConfigurationManager from '@/config/ConfigurationManager'
import jwt from 'jsonwebtoken'
import ClientRepository from '@data/repositories/ClientRepository'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
import { v5String } from 'uuid/interfaces'
import EmailAddressService from './EmailAddressService'
import EmailAddressRepository from '@data/repositories/EmailAddressRepository'
import UserAccountService from './UserAccountService'
import { IClientRequestOptions } from '@data/IClientRequestOptions'

export interface IAccessToken {
  id?: string
  sub: string
  scopes: string[]
  exp: number
}

export interface ISubject {
  sub: string
}

export interface IIDToken extends ISubject {
  iss: string
  at_hash: string | undefined
  aud: string
  exp: number
  iat: number
  nonce?: string
}

export interface IProfileClaim {
  name?: string
  given_name?: string
  family_name?: string
  nickname?: string | null
  profile?: string
  picture?: string
  updated_at?: number
}

export interface IEmailClaim {
  email?: string
  email_verified?: boolean
}

class TokenService {
  private hashToken(refreshToken: string, secret: string): string {
    return crypto
      .createHmac('sha256', secret)
      .update(refreshToken)
      .digest('hex')
  }

  public async createRefreshToken(client: IClient, userAccount: IUserAccount, maxAge: number | null, options: IQueryOptions): Promise<IRefreshToken> {
    const tokenData = randomBytes(256).toString('hex')
    const userClient = await UserClientRepository.getUserClient({ client_id: client.client_id, userAccountId: userAccount.userAccountId }, options)
    if (userClient && UserClientService.UserClientHasAllowedScope(userClient, ScopeMap.offline_access.id)) {
      const tokenData = randomBytes(64).toString('hex')

      const hashedToken = this.hashToken(tokenData, client.secret)

      let expiresAt: Date | undefined = undefined
      if (maxAge && maxAge > 0) {
        expiresAt = moment()
          .add(maxAge, 'seconds')
          .toDate()
      }
      const result = await RefreshTokenRepository.createRefreshToken(
        {
          token: hashedToken,
          userClientId: userClient.userClientId!,
          expiresAt: expiresAt
        },
        options
      )

      result.token = tokenData
      return result
    } else {
      throw new ForbiddenError('User has not granted client offline_access')
    }
  }

  public async createIDToken(client: IClient, userAccount: IUserAccount, nonce: string | undefined, accessToken: string | undefined, options: IQueryOptions): Promise<string> {
    const security = ConfigurationManager.Security!
    const serverConfig = ConfigurationManager.Server!

    const profile = await this.getUserProfileForClient(client, userAccount, options)
    let at_hash: string | undefined = undefined
    if (accessToken) {
      const hmac = crypto.createHmac('sha256', client.secret)
      const digest = hmac.update(accessToken).digest()

      const finalBytes = digest.slice(0, 15)
      at_hash = finalBytes.toString('base64')
    }

    const tokenBase: IIDToken = {
      iat: moment().unix(),
      exp: moment()
        .add(security.accessTokenExpirationSeconds, 'seconds')
        .unix(),
      aud: client.client_id,
      sub: profile.sub,
      at_hash: at_hash,
      iss: serverConfig.baseUrl,
      nonce: nonce
    }

    const result: IIDToken & IProfileClaim & IEmailClaim = Object.assign(tokenBase, profile)

    return jwt.sign(result, client.secret)
  }

  public async validateAndDecodeAccessToken(accessToken: string): Promise<IClientRequestOptions> {
    const decoded: IAccessToken | null = jwt.decode(accessToken) as IAccessToken
    if (decoded !== null) {
      const userClient = await UserClientRepository.getUserClient({ userClientId: decoded.sub }, { userContext: null })
      const client = await ClientRepository.getClientWithSensitiveData({ client_id: userClient!.client_id }, { userContext: null })
      if (client && jwt.verify(accessToken, client.secret)) {
        const userAccount = await UserAccountRepository.getUserAccount(
          {
            userAccountId: userClient!.userAccountId
          },
          { userContext: null }
        )
        if (userAccount) {
          return {
            client,
            userAccount,
            accessToken: decoded
          }
        }
      }
    }
    throw new Error('Invalid access token')
  }

  public async getUserProfileForClient(client: IClient, userAccount: IUserAccount, options: IQueryOptions): Promise<ISubject & IProfileClaim & IEmailClaim> {
    const userClient = await UserClientRepository.getUserClient({ client_id: client.client_id, userAccountId: userAccount.userAccountId }, options)

    if (userClient) {
      const result: ISubject & IProfileClaim & IEmailClaim = { sub: userClient.userClientId! }
      if (UserClientService.UserClientHasAllowedScope(userClient, ScopeMap.profile.id)) {
        result.given_name = userAccount.firstName
        result.family_name = userAccount.lastName
        result.nickname = userAccount.displayName
        result.updated_at = moment(userAccount.updatedAt).unix()
        result.name = `${userAccount.firstName} ${userAccount.lastName}`
      }
      if (UserClientService.UserClientHasAllowedScope(userClient, ScopeMap.email.id)) {
        const emailAddresses = await EmailAddressRepository.getEmailAddresses({ userAccountId_equals: userAccount.userAccountId }, options)
        const primaryEmailAddress = emailAddresses.find((e) => e.primary === true)
        result.email = primaryEmailAddress!.emailAddress
        result.email_verified = primaryEmailAddress!.verified
      }
      return result
    }
    throw new ForbiddenError('User has not authorized client')
  }

  public async getRefreshTokenFromRawToken(rawToken: string, client: IClient, options: IQueryOptions): Promise<IRefreshToken | null> {
    const hashedToken = this.hashToken(rawToken, client.secret)
    const result = await RefreshTokenRepository.getRefreshToken({ token: hashedToken }, options)
    if (result) {
      result.token = rawToken
    }

    return result
  }

  public async refreshAccessToken(refreshToken: string, client_id: string, options: IQueryOptions): Promise<string> {
    const client = await ClientRepository.getClientWithSensitiveData({ client_id }, options)
    if (!client) {
      throw new Error('Invalid client_id')
    }
    const hashedToken = this.hashToken(refreshToken, client.secret)
    const token = await RefreshTokenRepository.getRefreshToken({ token: hashedToken }, options)
    if (!token) {
      throw new ReferenceError('Refresh token does not exist')
    }
    if (token.deletedAt) {
      throw new Error('Refresh token has been deleted')
    }
    if (token.revokedAt) {
      throw new Error('Refresh token has been revoked')
    }

    token.activeAt = new Date()
    await RefreshTokenRepository.updateRefreshToken({ id: token.id }, token, options)
    const userClient = await UserClientRepository.getUserClient({ userClientId: token.userClientId }, options)
    if (userClient) {
      const client = await ClientRepository.getClientWithSensitiveData({ client_id: userClient!.client_id }, options)
      const userAccount = await UserAccountRepository.getUserAccount({ userAccountId: userClient.userAccountId }, options)

      return await this.createAccessToken(client!, userAccount!, token, options)
    }

    throw new Error('Failed refreshing access token')
  }

  public async createAccessToken(client: IClient, userAccount: IUserAccount, refreshToken: IRefreshToken | null, options: IQueryOptions): Promise<string> {
    const userClient = await UserClientRepository.getUserClient({ client_id: client.client_id, userAccountId: userAccount.userAccountId }, options)
    if (userClient && userClient.allowedScopes && userClient.allowedScopes.length > 0) {
      const allowedScopes = JSON.parse(userClient.allowedScopes)
      const result: IAccessToken = {
        sub: userClient.userClientId!,
        scopes: allowedScopes,
        exp: moment()
          .add(ConfigurationManager.Security!.accessTokenExpirationSeconds, 'seconds')
          .unix()
      }
      if (refreshToken) {
        result.id = refreshToken.id
      }

      return jwt.sign(result, client.secret)
    } else {
      throw new ForbiddenError('User has not authorized client')
    }
  }
}

export default new TokenService()
