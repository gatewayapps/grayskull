import ConfigurationManager from '@/config/ConfigurationManager'
import { Permissions } from '@/utils/permissions'
import { encrypt } from '@/utils/cipher'
import db from '@data/context'
import { ClientInstance } from '@data/models/Client'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import UserAccountServiceBase from '@services/UserAccountServiceBase'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import Cache from 'node-cache'
import ClientService from './ClientService'
import MailService from './MailService'
import UserClientService from './UserClientService'

const TokenCache = new Cache({ stdTTL: ConfigurationManager.Security.invitationExpiresIn })

interface ICPTToken {
  client: ClientInstance | { name: string; client_id?: number } | null
  emailAddress: string
  invitedById?: number
}

class UserAccountService extends UserAccountServiceBase {
  /**
   *
   * @param data
   * @param password
   */
  public async createUserAccountWithPassword(data: IUserAccount, password: string): Promise<UserAccountInstance> {
    data.passwordHash = await this.hashPassword(password)
    data.permissions = data.emailAddress === ConfigurationManager.Security.adminEmailAddress ? Permissions.Admin : Permissions.User
    data.lastPasswordChange = new Date()
    return super.createUserAccount(data)
  }

  public async changeUserPassword(emailAddress: string, password: string) {
    const passwordHash = await this.hashPassword(password)

    await db.UserAccount.update({ passwordHash, lastPasswordChange: new Date() }, { where: { emailAddress } })
  }

  public async inviteAdmin(baseUrl: string) {
    const token = this.generateCPT(
      ConfigurationManager.Security.adminEmailAddress,
      ConfigurationManager.Security.invitationExpiresIn,
      ConfigurationManager.General.grayskullClientId
    )
    this.sendInvitation(ConfigurationManager.Security.adminEmailAddress, `${ConfigurationManager.General.realmName} Global Administrator`, token, baseUrl)
  }

  public async sendResetPasswordMessage(emailAddress: string, baseUrl: string) {
    const cpt = this.generateCPT(emailAddress, ConfigurationManager.Security.invitationExpiresIn, undefined)
    const relativeTime = moment()
      .add(ConfigurationManager.Security.invitationExpiresIn, 'seconds')
      .fromNow(true)

    const body = `Please click the following link to reset your password.
    <a href='${baseUrl}/resetPassword?cpt=${cpt}' target='_blank'>Rest Password</a>

    This link will expire in ${relativeTime}.
    `

    MailService.sendMail(emailAddress, `Password Reset Instructions`, body, ConfigurationManager.Security.adminEmailAddress)
  }

  public async inviteUser(emailAddress: string, client: ClientInstance, invitedById: number, baseUrl: string): Promise<UserAccountInstance> {
    // Verify we have valid client instance
    if (!client || !client.client_id) {
      throw new Error('Invalid client')
    }

    // Lookup the user who is inviting the new user
    const invitedByUser = await this.getUserAccount({ userAccountId: invitedById })
    if (!invitedByUser || !invitedByUser.userAccountId) {
      throw new Error('invitedBy user account not found')
    }

    // Check to see if there is already a user
    const user = await this.getUserAccount({ emailAddress })
    if (user && user.userAccountId && user.passwordHash) {
      // See if the user is already associated with the client
      const userClient = await UserClientService.getUserClient({ userAccountId: user.userAccountId, client_id: client.client_id })
      if (userClient) {
        // User is already associated with the client nothing else to do
        return user
      }
      // Link the client to the user
      await UserClientService.createUserClient({
        userAccountId: user.userAccountId,
        client_id: client.client_id,
        createdBy: invitedByUser.userAccountId,
        revoked: false,
      })
      // Send an email to the user to notify them of the new access
      this.sendNewClientAccess(user.emailAddress, client, invitedByUser)
      return user
    }

    // 3. Create a userAccount placeholder
    let newUser = user
    if (!newUser) {
      newUser = await super.createUserAccount({
        emailAddress,
        isActive: false,
        firstName: '',
        lastName: '',
        lastPasswordChange: new Date(0),
        passwordHash: '',
        phoneNumber: '',
        profileImageUrl: '',
      })
    }

    // 4. Send an inviation to the user
    const token = this.generateCPT(emailAddress, ConfigurationManager.Security.invitationExpiresIn, client.client_id, invitedByUser.userAccountId)
    this.sendInvitation(emailAddress, client.name, token, baseUrl, invitedByUser)
    return newUser
  }

  public async processCPT(cpt: string, removeFromCache: boolean = true): Promise<ICPTToken> {
    const decoded = this.decodeCPT(cpt)
    const emailAddress = decoded.emailAddress
    const invitedById = decoded.invitedById
    let client
    if (decoded.client_id) {
      client = await ClientService.getClient({ client_id: decoded.client_id })
    } else if (decoded.admin) {
      client = { name: `${ConfigurationManager.General.realmName} Global Administrator` }
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

  public async registerUser(data: IUserAccount, password: string, cpt: string, otpSecret?: string) {
    // 1. Parse the cpt
    const token = await this.processCPT(cpt)
    if (!token) {
      throw new Error('Invalid CPT token')
    }

    // 2. Load the existing userAccount
    let user: UserAccountInstance | null
    const existingUser = await super.getUserAccount({ emailAddress: token.emailAddress })
    if (existingUser) {
      // Activate the existing user account and set password
      data.passwordHash = await this.hashPassword(password)
      if (otpSecret !== undefined && otpSecret.length > 0) {
        data.otpSecret = encrypt(otpSecret)
        data.otpEnabled = true
      }
      data.lastPasswordChange = new Date()
      data.isActive = true
      user = await this.updateUserAccount({ emailAddress: existingUser.emailAddress }, data)
    } else {
      // Create a new user account since there is not already one existing
      data.emailAddress = token.emailAddress
      if (otpSecret !== undefined && otpSecret.length > 0) {
        data.otpSecret = encrypt(otpSecret)
        data.otpEnabled = true
      }
      user = await this.createUserAccountWithPassword(data, password)
    }
    if (!user) {
      throw new Error('User is missing')
    }

    // 3. Link the user to the client
    if (token.client && token.client.client_id) {
      await UserClientService.createUserClient({
        userAccountId: user.userAccountId!,
        client_id: token.client.client_id,
        createdBy: token.invitedById || user.userAccountId!,
        revoked: false,
      })
    }

    // 4. Ensure the user is linked to the Grayskull Client
    const grayskullUserClient = await UserClientService.getUserClient({ client_id: ConfigurationManager.General.grayskullClientId, userAccountId: user.userAccountId! })
    if (!grayskullUserClient) {
      await UserClientService.createUserClient({
        userAccountId: user.userAccountId!,
        client_id: ConfigurationManager.General.grayskullClientId,
        createdBy: token.invitedById || user.userAccountId!,
        revoked: false,
      })
    }

    const client = token.client!.client_id ? await ClientService.getClient({ client_id: token.client!.client_id! }) : await ClientService.getClient({ client_id: 1 })
    return {
      client,
      userAccount: user,
    }
  }

  public validateCPT(token: string): boolean {
    if (TokenCache.get<number | undefined>(token) !== 1) {
      return false
    }
    try {
      return !!jwt.verify(token, ConfigurationManager.Security.globalSecret)
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
    const body = `${invitedByUser.firstName} ${invitedByUser.lastName} has given you access to <a href="${client.url}">${client.name}</a>.`
    MailService.sendMail(emailAddress, `${client.name} Invitation`, body, ConfigurationManager.Security.adminEmailAddress)
  }

  private sendInvitation(emailAddress: string, clientName: string, token: string, baseUrl: string, invitedByUser?: UserAccountInstance) {
    const relativeTime = moment()
      .add(ConfigurationManager.Security.invitationExpiresIn, 'seconds')
      .fromNow(true)

    const invitedByMessage = invitedByUser
      ? `<p>${invitedByUser.firstName} ${invitedByUser.lastName} has invited you to start using ${clientName}.</p>`
      : ''

    const body = `${invitedByMessage}<p>Please click the following link to accept your invitation to register for ${clientName}
    <a href='${baseUrl}/register?cpt=${token}' target='_blank'>Register</a></p>
    <p>This link will expire in ${relativeTime}.</p>
    `

    MailService.sendMail(emailAddress, `${clientName} Invitation`, body, ConfigurationManager.Security.adminEmailAddress)
  }

  private generateCPT(emailAddress: string, expiresIn: number, client_id?: number, invitedById?: number): string {
    const newToken = jwt.sign(
      {
        emailAddress,
        client_id,
        invitedById,
      },
      ConfigurationManager.Security.globalSecret,
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
