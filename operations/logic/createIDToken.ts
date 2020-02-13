import { getUserProfileForClient } from './getUserProfileForClient'
import { UserContext } from '../../foundation/context/getUserContext'
import { Client } from '../../foundation/models/Client'
import { IConfiguration } from '../../foundation/types/types'

import { IIDToken, IProfileClaim, IEmailClaim } from '../../server/api/services/TokenService'
import moment from 'moment'
import { UserClient } from '../../foundation/models/UserClient'
import { createHmac } from 'crypto'
import jwt from 'jsonwebtoken'

export async function createIDToken(
  userContext: UserContext,
  client: Client,
  userClient: UserClient,
  nonce: string | undefined,
  accessToken: string | undefined,

  configuration: IConfiguration
): Promise<string> {
  const security = configuration.Security!
  const serverConfig = configuration.Server!

  const profile = getUserProfileForClient(userContext, userClient)
  let at_hash: string | undefined = undefined
  if (accessToken) {
    const hmac = createHmac('sha256', client.secret)
    const digest = hmac.update(accessToken).digest()

    const finalBytes = digest.slice(0, 15)
    at_hash = finalBytes.toString('base64')
  }

  const tokenBase: IIDToken = {
    iat: moment().unix(),
    exp: moment()
      .add(security.accessTokenExpirationSeconds || 300, 'seconds')
      .unix(),
    aud: client.client_id,
    sub: profile.sub,
    at_hash: at_hash,
    iss: serverConfig.baseUrl!,
    nonce: nonce
  }

  const result: IIDToken & IProfileClaim & IEmailClaim = Object.assign(tokenBase, profile)

  return jwt.sign(result, client.secret)
}
