import ConfigurationManager from '@/config/ConfigurationManager'
import { GrayskullError, GrayskullErrorCode } from '@/GrayskullError'
import { Permissions } from '@/utils/permissions'
import { encrypt } from '@/utils/cipher'
import { getContext } from '@data/context'
import { ClientInstance } from '@data/models/Client'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import UserAccountServiceBase from '@services/UserAccountServiceBase'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Cache from 'node-cache'
import { Transaction } from 'sequelize'
import uuid from 'uuid/v4'
import ClientService from './ClientService'
import EmailAddressService from './EmailAddressService'
import MailService from './MailService'
import UserClientService from './UserClientService'
import { IUserClient } from '@data/models/IUserClient'
import { IEmailAddress } from '@data/models/IEmailAddress'

const INVITATION_EXPIRES_IN = 3600

const TokenCache = new Cache({ stdTTL: INVITATION_EXPIRES_IN })

interface ICPTToken {
  client: ClientInstance | { name: string; client_id: string } | null
  emailAddress: string
  invitedById?: number
}

class UserAccountService extends UserAccountServiceBase {
  /**
   *
   * @param data
   * @param password
   */
  public async createUserAccountWithPassword(data: IUserAccount, password: string, transaction?: Transaction): Promise<UserAccountInstance> {
    data.userAccountId = uuid()
    data.passwordHash = await this.hashPassword(password)
    data.lastPasswordChange = new Date()
    if (data.otpSecret !== undefined && data.otpSecret.length > 0) {
      data.otpSecret = encrypt(data.otpSecret)
      data.otpEnabled = true
    }
    return super.createUserAccount(data, undefined, transaction)
  }

  public async changeUserPassword(emailAddress: string, password: string) {
    const passwordHash = await this.hashPassword(password)

    await getContext().UserAccount.update({ passwordHash, lastPasswordChange: new Date() }, { where: { emailAddress } })
  }

  public async getUserAccountByEmailAddress(emailAddress: string): Promise<UserAccountInstance | null> {
    const email = await EmailAddressService.getEmailAddress({ emailAddress })
    if (!email) {
      return null
    }
    return super.getUserAccount({ userAccountId: email.userAccountId })
  }

  public async getUserAccountByEmailAddressWithSensitiveData(emailAddress: string): Promise<UserAccountInstance | null> {
    const email = await EmailAddressService.getEmailAddress({ emailAddress })
    if (!email) {
      return null
    }
    return super.getUserAccountWithSensitiveData({ userAccountId: email.userAccountId })
  }

  public async sendResetPasswordMessage(emailAddress: string, baseUrl: string) {
    const cpt = this.generateCPT(emailAddress, INVITATION_EXPIRES_IN, undefined)
    const relativeTime = moment()
      .add(INVITATION_EXPIRES_IN, 'seconds')
      .fromNow(true)

    const body = `Please click the following link to reset your password.
    <a href='${baseUrl}/resetPassword?cpt=${cpt}' target='_blank'>Rest Password</a>

    This link will expire in ${relativeTime}.
    `

    MailService.sendMail(emailAddress, `Password Reset Instructions`, body)
  }

  public async processCPT(cpt: string, removeFromCache: boolean = true): Promise<ICPTToken> {
    const decoded = this.decodeCPT(cpt)
    const emailAddress = decoded.emailAddress
    const invitedById = decoded.invitedById
    let client
    if (decoded.client_id) {
      client = await ClientService.getClient({ client_id: decoded.client_id })
    } else if (decoded.admin) {
      client = { name: `${ConfigurationManager.General!.realmName} Global Administrator` }
    }
    if (removeFromCache) {
      TokenCache.del(cpt)
    }
    return {
      client,
      emailAddress,
      invitedById
    }
  }

  public async registerUser(data: IUserAccount, emailAddress: string, password: string): Promise<UserAccountInstance> {
    // 1. Verify that a user has not already been registered with this email address
    const existingEmailAddress = await EmailAddressService.getEmailAddress({ emailAddress })
    if (existingEmailAddress) {
      throw new GrayskullError(GrayskullErrorCode.EmailAlreadyRegistered, 'The email address has already been registered')
    }

    // 2. Start a transaction
    const trx = await getContext().sequelize.transaction()

    try {
      // First user is always an administrator
      const userMeta = await super.userAccountsMeta()
      // 3. Create the user account
      data.permissions = userMeta.count === 0 ? Permissions.Admin : Permissions.User
      const user = await this.createUserAccountWithPassword(data, password, trx)

      // 4. Create the user account email
      const emailAddressData: IEmailAddress = {
        userAccountId: user.userAccountId!,
        emailAddress: emailAddress,
        primary: true
      }
      await EmailAddressService.createEmailAddress(emailAddressData, user, trx)

      // 5. Create a UserClient for Grayskull
      const userClientData: IUserClient = {
        client_id: 'grayskull',
        userAccountId: user.userAccountId!,
        createdBy: user.userAccountId!
      }
      await UserClientService.createUserClient(userClientData, user, trx)

      // 6. Commit the transaction
      await trx.commit()

      return user
    } catch (err) {
      await trx.rollback()
      throw err
    }
  }

  public validateCPT(token: string): boolean {
    if (TokenCache.get<number | undefined>(token) !== 1) {
      return false
    }
    try {
      return !!jwt.verify(token, ConfigurationManager.Security!.globalSecret)
    } catch (err) {
      return false
    }
  }

  public decodeCPT(token: string): any {
    if (this.validateCPT(token) === false) {
      return undefined
    } else {
      return jwt.decode(token)
    }
  }

  private sendNewClientAccess(emailAddress: string, client: ClientInstance, invitedByUser: UserAccountInstance) {
    const body = `${invitedByUser.firstName} ${invitedByUser.lastName} has given you access to <a href="${client.homePageUrl || client.baseUrl}">${client.name}</a>.`
    MailService.sendMail(emailAddress, `${client.name} Invitation`, body)
  }

  private sendInvitation(emailAddress: string, clientName: string, token: string, baseUrl: string, invitedByUser?: UserAccountInstance) {
    const relativeTime = moment()
      .add(INVITATION_EXPIRES_IN, 'seconds')
      .fromNow(true)

    const invitedByMessage = invitedByUser ? `<p>${invitedByUser.firstName} ${invitedByUser.lastName} has invited you to start using ${clientName}.</p>` : ''

    const body = `${invitedByMessage}<p>Please click the following link to accept your invitation to register for ${clientName}
    <a href='${baseUrl}/register?cpt=${token}' target='_blank'>Register</a></p>
    <p>This link will expire in ${relativeTime}.</p>
    `

    MailService.sendMail(emailAddress, `${clientName} Invitation`, body)
  }

  private generateCPT(emailAddress: string, expiresIn: number, client_id?: string, invitedById?: number): string {
    const newToken = jwt.sign(
      {
        emailAddress,
        client_id,
        invitedById
      },
      ConfigurationManager.Security!.globalSecret,
      {
        expiresIn
      }
    )

    TokenCache.set(newToken, 1)

    return newToken
  }

  private hashPassword(password: string): Promise<string> {
    const PASSWORD_SALT_ROUNDS = 10

    return bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
  }
}

export default new UserAccountService()
