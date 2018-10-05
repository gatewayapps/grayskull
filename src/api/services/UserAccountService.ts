import { ClientInstance } from '@data/models/Client'
import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import AuthenticationService from '@services/AuthenticationService'
import UserAccountServiceBase from '@services/UserAccountServiceBase'
import bcrypt from 'bcrypt'

import ConfigurationManager from '@/config/ConfigurationManager'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import ClientService from './ClientService'
import MailService from './MailService'

class UserAccountService extends UserAccountServiceBase {
  public async createUserAccountWithPassword(data: IUserAccount, password: string): Promise<UserAccountInstance> {
    const PASSWORD_SALT_ROUNDS = 10

    data.password_hash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
    return super.createUserAccount(data)
  }

  public async inviteAdmin() {
    const token = this.generateCPT(ConfigurationManager.Security.adminEmailAddress, ConfigurationManager.Security.invitationExpiresIn, true)
    this.sendInvitation(ConfigurationManager.Security.adminEmailAddress, `${ConfigurationManager.General.realmName} Global Administrator`, token)
  }

  public async inviteUser(emailAddress: string, clientId: number) {
    const client = await ClientService.getClientByclientId(clientId)
    if (client) {
      const token = this.generateCPT(emailAddress, ConfigurationManager.Security.invitationExpiresIn, false, clientId)
      this.sendInvitation(emailAddress, client.name, token)
    }
  }

  public async processCPT(cpt: string): Promise<{ client: ClientInstance | { name: string } | null; emailAddress: string; admin: boolean }> {
    const decoded = this.decodeCPT(cpt)
    const emailAddress = decoded.emailAddress
    let client
    if (decoded.clientId) {
      client = await ClientService.getClientByclientId(decoded.clientId)
    } else if (decoded.admin) {
      client = { name: `${ConfigurationManager.General.realmName} Global Administrator` }
    }
    return {
      client,
      emailAddress,
      admin: decoded.admin
    }
  }

  public validateCPT(token: string): boolean {
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

  private sendInvitation(emailAddress: string, clientName: string, token: string) {
    const relativeTime = moment()
      .add(ConfigurationManager.Security.invitationExpiresIn, 'seconds')
      .fromNow(true)

    const body = `Please click the following link to accept your invitation to register for ${clientName}
    http://localhost:3000/register?cpt=${token}

    This link will expire in ${relativeTime}.
    `

    MailService.sendMail(emailAddress, `${clientName} Invitation`, body, 'admin@grayskull.io')
  }

  private generateCPT(emailAddress: string, expiresIn: number, admin: boolean, clientId?: number): string {
    return jwt.sign(
      {
        emailAddress,
        clientId,
        admin: ConfigurationManager.Security.adminEmailAddress === emailAddress ? true : undefined
      },
      ConfigurationManager.Security.globalSecret,
      {
        expiresIn
      }
    )
  }
}

export default new UserAccountService()
