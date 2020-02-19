import { IUserClient } from '../../foundation/types/types'

import moment from 'moment'

import { userClientHasAllowedScope } from './userClientHasAllowedScope'
import { UserContext } from '../../foundation/context/getUserContext'
import { ScopeMap } from '../../foundation/constants/scopes'
import { ISubject, IProfileClaim, IEmailClaim } from '../../foundation/types/tokens'

export function getUserProfileForClient(
  userAccount: UserContext,
  userClient: IUserClient
): ISubject & IProfileClaim & IEmailClaim {
  const result: ISubject & IProfileClaim & IEmailClaim = { sub: userClient.userClientId }
  if (userClientHasAllowedScope(userClient, ScopeMap.profile.id)) {
    result.given_name = userAccount.firstName
    result.family_name = userAccount.lastName
    result.nickname = userAccount.displayName
    result.picture = userAccount.profileImageUrl
    result.updated_at = moment(userAccount.updatedAt).unix()
    result.name = `${userAccount.firstName} ${userAccount.lastName}`
  }
  if (userClientHasAllowedScope(userClient, ScopeMap.email.id)) {
    result.email = userAccount.emailAddress
    result.email_verified = userAccount.emailAddressVerified
  }
  return result
}
