import SessionServiceBase from '@services/SessionServiceBase'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import { SessionInstance } from '@data/models/Session'
import bcrypt from 'bcrypt'
import moment from 'moment'
import { Transaction } from 'sequelize'

const SESSION_EXPIRATION_SECONDS = 60 * 60

type ICreateSession = Pick<ISession, 'fingerprint' | 'userAccountId' | 'ipAddress'>

class SessionService extends SessionServiceBase {
  public async createSession(data: ICreateSession, userContext?: IUserAccount, transaction?: Transaction): Promise<SessionInstance> {
    const fingerprint = await this.hashFingerprint(data.fingerprint)
    const newSession: ISession = {
      ...data,
      fingerprint,
      expiresAt: moment()
        .add(SESSION_EXPIRATION_SECONDS, 'seconds')
        .toDate()
    }
    return super.createSession(newSession, userContext, transaction)
  }

  public async verifyAndUseSession(sessionId: string, fingerprint: string, ipAddress: string): Promise<SessionInstance | null> {
    try {
      const session = await super.getSession({ sessionId })
      if (!session) {
        return null
      }
      if (!(await bcrypt.compare(fingerprint, session.fingerprint))) {
        return null
      }
      if (session.expiresAt < new Date()) {
        return null
      }

      return super.updateSession(
        { sessionId },
        {
          ipAddress,
          lastUsedAt: new Date(),
          expiresAt: moment()
            .add(SESSION_EXPIRATION_SECONDS, 'seconds')
            .toDate()
        }
      )
    } catch (err) {
      return null
    }
  }

  private hashFingerprint(fingerprint: string): Promise<string> {
    const FINGERPRINT_SALT_ROUNDS = 10

    return bcrypt.hash(fingerprint, FINGERPRINT_SALT_ROUNDS)
  }
}

export default new SessionService()
