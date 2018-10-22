import db from '@data/context'
import { ClientInstance } from '@data/models/Client'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import UserAccountServiceBase from '@services/UserAccountServiceBase'
import bcrypt from 'bcrypt'

import ConfigurationManager from '@/config/ConfigurationManager'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import ClientService from './ClientService'
import MailService from './MailService'

import Cache from 'node-cache'

const TokenCache = new Cache({ stdTTL: ConfigurationManager.Security.invitationExpiresIn })

class UserAccountService extends UserAccountServiceBase {
  public async createUserAccountWithPassword(data: IUserAccount, password: string): Promise<UserAccountInstance> {
    const PASSWORD_SALT_ROUNDS = 10

    data.passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
    return super.createUserAccount(data)
  }

  public async changeUserPassword(emailAddress: string, password: string) {
    const PASSWORD_SALT_ROUNDS = 10

    const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)

    await db.UserAccount.update({ passwordHash }, { where: { emailAddress } })
  }

  public async inviteAdmin(baseUrl: string) {
    const token = this.generateCPT(ConfigurationManager.Security.adminEmailAddress, ConfigurationManager.Security.invitationExpiresIn, true)
    this.sendInvitation(ConfigurationManager.Security.adminEmailAddress, `${ConfigurationManager.General.realmName} Global Administrator`, token, baseUrl)
  }

  public async sendResetPasswordMessage(emailAddress: string, baseUrl: string) {
    const cpt = this.generateCPT(emailAddress, ConfigurationManager.Security.invitationExpiresIn, false, undefined)
    const relativeTime = moment()
      .add(ConfigurationManager.Security.invitationExpiresIn, 'seconds')
      .fromNow(true)

    const body = `Please click the following link to reset your password.
    <a href='${baseUrl}/resetPassword?cpt=${cpt}' target='_blank'>Rest Password</a>

    This link will expire in ${relativeTime}.
    `

    MailService.sendMail(emailAddress, `Password Reset Instructions`, body, 'admin@grayskull.io')
  }

  public async inviteUser(emailAddress: string, client_id: number, baseUrl: string) {
    const client = await ClientService.getClientByclient_id(client_id)
    if (client) {
      const token = this.generateCPT(emailAddress, ConfigurationManager.Security.invitationExpiresIn, false, client_id)
      this.sendInvitation(emailAddress, client.name, token, baseUrl)
    }
  }

  public async processCPT(cpt: string, removeFromCache: boolean = true): Promise<{ client: ClientInstance | { name: string; client_id?: number } | null; emailAddress: string; admin: boolean }> {
    const decoded = this.decodeCPT(cpt)
    const emailAddress = decoded.emailAddress
    let client
    if (decoded.client_id) {
      client = await ClientService.getClientByclient_id(decoded.client_id)
    } else if (decoded.admin) {
      client = { name: `${ConfigurationManager.General.realmName} Global Administrator` }
    }
    if (removeFromCache) {
      TokenCache.del(cpt)
    }
    return {
      client,
      emailAddress,
      admin: decoded.admin
    }
  }

  public validateCPT(token: string): boolean {
    if (TokenCache.get<number | undefined>(token) !== 1) {
      return false
    }
    try {
      return !!jwt.verify(token, ConfigurationManager.Security.globalSecret)
    } catch {
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

  private sendInvitation(emailAddress: string, clientName: string, token: string, baseUrl: string) {
    const relativeTime = moment()
      .add(ConfigurationManager.Security.invitationExpiresIn, 'seconds')
      .fromNow(true)

    const body = `Please click the following link to accept your invitation to register for ${clientName}
    <a href='${baseUrl}/register?cpt=${token}' target='_blank'>Register</a>

    This link will expire in ${relativeTime}.
    `

    MailService.sendMail(emailAddress, `${clientName} Invitation`, body, 'admin@grayskull.io')
  }

  private generateCPT(emailAddress: string, expiresIn: number, admin: boolean, client_id?: number): string {
    const newToken = jwt.sign(
      {
        emailAddress,
        client_id,
        admin: ConfigurationManager.Security.adminEmailAddress === emailAddress ? true : undefined
      },
      ConfigurationManager.Security.globalSecret,
      {
        expiresIn
      }
    )

    TokenCache.set(newToken, 1)

    return newToken
  }
}

export default new UserAccountService()
