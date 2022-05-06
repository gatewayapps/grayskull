import { IConfiguration, IUserAccount } from '../types/types'

import { CacheContext } from './getCacheContext'
import Knex from 'knex'
import { getPrimaryEmailAddress } from '../../operations/data/emailAddress/getPrimaryEmailAddress'
import { getPrimaryPhoneNumberForUserAccount } from '../../operations/data/phoneNumber/getPrimaryPhoneNumberForUserAccount'
import { getUserAccount } from '../../operations/data/userAccount/getUserAccount'
import { verifyAndUseSession } from '../../operations/data/session/verifyAndUseSession'

export type UserContext = IUserAccount & { emailAddress: string; emailAddressVerified: boolean; phoneNumber?: string }

export async function createUserContextForUserId(
	userAccountId: string,
	dataContext: Knex,
	cacheContext: CacheContext,
	configuration: IConfiguration
) {
	const userAccount = await getUserAccount(userAccountId, dataContext, cacheContext, false)
	if (!userAccount) {
		return undefined
	}
	const primaryEmailAddress = await getPrimaryEmailAddress(userAccount.userAccountId, dataContext, cacheContext)
	const primaryPhoneNumber = await getPrimaryPhoneNumberForUserAccount(userAccount.userAccountId, dataContext)
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
		emailAddressVerified: primaryEmailAddress && primaryEmailAddress.verified ? true : false,
		phoneNumber: primaryPhoneNumber ? primaryPhoneNumber.phoneNumber : undefined,
		properties: userAccount.properties
	}
}

export async function getUserContext(
	sessionId: string,
	dataContext: Knex,
	cacheContext: CacheContext,
	configuration: IConfiguration
): Promise<UserContext | undefined> {
	if (!sessionId) {
		return undefined
	} else {
		const session = await verifyAndUseSession(sessionId, dataContext, cacheContext)
		if (!session) {
			return undefined
		} else {
			return createUserContextForUserId(session.userAccountId, dataContext, cacheContext, configuration)
		}
	}
}
