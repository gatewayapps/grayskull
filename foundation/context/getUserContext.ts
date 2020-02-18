import { DataContext } from './getDataContext'
import { CacheContext } from './getCacheContext'

import { getUserAccount } from '../../operations/data/userAccount/getUserAccount'
import { verifyAndUseSession } from '../../operations/data/session/verifyAndUseSession'

import { getPrimaryEmailAddress } from '../../operations/data/emailAddress/getPrimaryEmailAddress'
import { IUserAccount, IConfiguration } from '../types/types'

export type UserContext = IUserAccount & { emailAddress: string; emailAddressVerified: boolean }

export async function createUserContextForUserId(
  userAccountId: string,
  dataContext: DataContext,
  cacheContext: CacheContext,
  configuration: IConfiguration
) {
  const userAccount = await getUserAccount(userAccountId, dataContext, cacheContext, false)
  if (!userAccount) {
    return undefined
  }
  const primaryEmailAddress = await getPrimaryEmailAddress(userAccount.userAccountId, dataContext, cacheContext)

  let profileImage = userAccount.profileImageUrl
  if (profileImage) {
    try {
      new URL(profileImage)
    } catch (err) {
      profileImage = new URL(profileImage, configuration.Server.baseUrl!).href
    }
  }

  return {
    userAccountId: userAccount.userAccountId,
    firstName: userAccount.firstName,
    lastName: userAccount.lastName,
    displayName: userAccount.displayName,
    lastActive: userAccount.lastActive,
    lastPasswordChange: userAccount.lastPasswordChange,
    gender: userAccount.gender,
    birthday: userAccount.birthday,
    profileImageUrl: profileImage,
    permissions: userAccount.permissions,
    otpSecret: userAccount.otpSecret,
    otpEnabled: userAccount.otpEnabled,
    isActive: userAccount.isActive,
    passwordHash: userAccount.passwordHash,
    createdBy: userAccount.createdBy,
    createdAt: userAccount.createdAt,
    updatedBy: userAccount.updatedBy,
    updatedAt: userAccount.updatedAt,
    deletedBy: userAccount.deletedBy,
    deletedAt: userAccount.deletedAt,
    emailAddress: primaryEmailAddress ? primaryEmailAddress.emailAddress : '',
    emailAddressVerified: primaryEmailAddress && primaryEmailAddress.verified ? true : false
  }
}

export async function getUserContext(
  sessionId: string,
  fingerprint: string,
  dataContext: DataContext,
  cacheContext: CacheContext,
  configuration: IConfiguration
): Promise<UserContext | undefined> {
  if (!sessionId) {
    return undefined
  } else {
    const session = await verifyAndUseSession(sessionId, fingerprint, dataContext, cacheContext)
    if (!session) {
      return undefined
    } else {
      return createUserContextForUserId(session.userAccountId, dataContext, cacheContext, configuration)
    }
  }
}
