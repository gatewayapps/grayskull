import { IUserAccount } from '@data/models/IUserAccount'
import { UserAccountInstance } from '@data/models/UserAccount'
import bcrypt from 'bcrypt'
import config from 'config'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import UserAccountServiceBase from './.cradle/UserAccountServiceBase'
import ClientService from './ClientService'
import MailService from './MailService'

const security: any = config.get('Security')
const general: any = config.get('General')

class UserAccountService extends UserAccountServiceBase {
  public async createUserAccountWithPassword(data: IUserAccount, password: string): Promise<UserAccountInstance> {
    const PASSWORD_SALT_ROUNDS = 10

    data.password_hash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS)
    return super.createUserAccount(data)
  }

  public async inviteAdmin() {
    const token = this.generateCPT(security.adminEmailAddress, security.invitationExpiresIn, true)
    this.sendInvitation(security.adminEmailAddress, `${general.realmName} Global Administrator`, token)
  }

  public async inviteUser(emailAddress: string, clientId: number) {
    const client = await ClientService.getClientByclientId(clientId)
    if (client) {
      const token = this.generateCPT(emailAddress, security.invitationExpiresIn, false, clientId)
      this.sendInvitation(emailAddress, client.name, token)
    }
  }

  public validateCPT(token: string): boolean {
    return !!jwt.verify(token, security.globalSecret)
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
      .add(security.invitationExpiresIn, 'seconds')
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
        admin: security.adminEmailAddress === emailAddress ? true : undefined
      },
      security.globalSecret,
      {
        expiresIn
      }
    )
  }
}

export default new UserAccountService()
