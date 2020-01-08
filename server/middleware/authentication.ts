import { Session } from '../data/models/Session'
import { UserAccount } from '../data/models/UserAccount'

const FIRST_USER_CREATED = false
const MIN_TIME_TO_UPDATE_LAST_ACTIVE = 60 * 1000 // 1 minute

export interface IRefreshAccessTokenResult {
  access_token: string
  expires_in: number
}

declare global {
  namespace Express {
    interface Request {
      user?: UserAccount
      session?: Session
    }
  }
}
