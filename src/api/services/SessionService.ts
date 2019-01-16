import SessionServiceBase from '@services/SessionServiceBase'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import { SessionInstance } from '@data/models/Session'
import bcrypt from 'bcrypt'
import { Transaction } from 'sequelize'

class SessionService extends SessionServiceBase {
  public async createSession(data: ISession, userContext?: IUserAccount, transaction?: Transaction): Promise<SessionInstance> {
    data.fingerprint = await this.hashFingerprint(data.fingerprint)
    return super.createSession(data, userContext, transaction)
  }

  private hashFingerprint(fingerprint: string): Promise<string> {
    const FINGERPRINT_SALT_ROUNDS = 10

    return bcrypt.hash(fingerprint, FINGERPRINT_SALT_ROUNDS)
  }
}

export default new SessionService()
