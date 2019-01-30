import { ISession } from '@data/models/ISession'
import { IUserAccount } from '@data/models/IUserAccount'
import { SessionInstance } from '@data/models/Session'
import bcrypt from 'bcrypt'
import moment from 'moment'
import { Transaction } from 'sequelize'
import { IQueryOptions } from '../../data/IQueryOptions'
import { ISessionUniqueFilter } from '@/interfaces/graphql/ISession'
import SessionRepository from '@data/repositories/SessionRepository'

const SESSION_EXPIRATION_SECONDS = 60 * 60

type ICreateSession = Pick<ISession, 'fingerprint' | 'userAccountId' | 'ipAddress'>

class SessionService {
  public async createSession(data: ICreateSession, options: IQueryOptions): Promise<ISession> {
    const fingerprint = await this.hashFingerprint(data.fingerprint)
    const newSession: ISession = {
      ...data,
      fingerprint,
      expiresAt: moment()
        .add(SESSION_EXPIRATION_SECONDS, 'seconds')
        .toDate()
    }
    return SessionRepository.createSession(newSession, options)
  }

  public async verifyAndUseSession(sessionId: string, fingerprint: string, ipAddress: string, options: IQueryOptions): Promise<ISession | null> {
    try {
      const session = await SessionRepository.getSession({ sessionId }, options)

      if (!session) {
        return null
      }
      if (!(await bcrypt.compare(fingerprint, session.fingerprint))) {
        return null
      }
      if (session.expiresAt < new Date()) {
        return null
      }
      return SessionRepository.updateSession(
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

  public async deleteSession(filter: ISessionUniqueFilter, options: IQueryOptions): Promise<boolean> {
    return SessionRepository.deleteSession(filter, options)
  }
}

export default new SessionService()
