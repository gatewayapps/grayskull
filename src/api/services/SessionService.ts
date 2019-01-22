import SessionServiceBase from '@services/SessionServiceBase'
import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import { SessionInstance } from '@data/models/Session'
import bcrypt from 'bcrypt'
import moment from 'moment'
import { Transaction } from 'sequelize'
import { IServiceOptions } from './IServiceOptions'
import { ISessionUniqueFilter } from '@/interfaces/graphql/ISession'

const SESSION_EXPIRATION_SECONDS = 60 * 60

type ICreateSession = Pick<ISession, 'fingerprint' | 'userAccountId' | 'ipAddress'>

class SessionService extends SessionServiceBase {
  public async createSession(data: ICreateSession, options: IServiceOptions): Promise<SessionInstance> {
    const fingerprint = await this.hashFingerprint(data.fingerprint)
    const newSession: ISession = {
      ...data,
      fingerprint,
      expiresAt: moment()
        .add(SESSION_EXPIRATION_SECONDS, 'seconds')
        .toDate()
    }
    return super.createSession(newSession, options)
  }

  public async verifyAndUseSession(sessionId: string, fingerprint: string, ipAddress: string, options: IServiceOptions): Promise<SessionInstance | null> {
    try {
      const session = await super.getSession({ sessionId }, options)

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
        },
        { userContext: null }
      )
    } catch (err) {
      return null
    }
  }

  private hashFingerprint(fingerprint: string): Promise<string> {
    const FINGERPRINT_SALT_ROUNDS = 10

    return bcrypt.hash(fingerprint, FINGERPRINT_SALT_ROUNDS)
  }

  public async deleteSession(filter: ISessionUniqueFilter, options: IServiceOptions): Promise<boolean> {
    return super.deleteSession(filter, options)
  }
}

export default new SessionService()
