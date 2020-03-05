import { IRequestContext } from '../foundation/context/prepareContext'
import { getEmailAddressByEmailAddress } from '../operations/data/emailAddress/getEmailAddressByEmailAddress'
import { GrayskullError, GrayskullErrorCode } from '../foundation/errors/GrayskullError'
import { compare } from 'bcrypt'
import { getUserAccountByEmailAddress } from '../operations/data/userAccount/getUserAccountByEmailAddress'
import { decrypt } from '../operations/logic/encryption'
import * as otplib from 'otplib'
import { verifyBackupMultifactorCode } from '../operations/data/userAccount/verifyBackupMultifactorCode'
import { clearBackupMultifactorCode } from '../operations/data/userAccount/clearBackupMultifactorCode'

import { createSession } from '../operations/data/session/createSession'

/*
  1. Find user by email address
  2. Verify password
  3. Verify email has been verified
  4. Check if otp enabled and if token is provided
  5. Check if otp is required and not configured for user
  6. Create a session and return it
*/

export async function authenticateUserActivity(
	emailAddress: string,
	password: string,
	context: IRequestContext,
	otpToken?: string,
	extendedSession = false
) {
	const emailRecord = await getEmailAddressByEmailAddress(emailAddress, context.dataContext)
	if (!emailRecord) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailAddress,
			`Attempted to sign in with email address ${emailAddress} which is not registered`
		)
	}
	if (!emailRecord.verified) {
		throw new GrayskullError(
			GrayskullErrorCode.EmailNotVerified,
			`Attempted to sign in with email address ${emailAddress} which is not verified`
		)
	}
	if (!emailRecord.primary) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailAddress,
			`Attempted to sign in with email address ${emailAddress} which is not a primary address`
		)
	}
	const userAccount = await getUserAccountByEmailAddress(emailAddress, context.dataContext, undefined, true)
	if (!userAccount) {
		throw new GrayskullError(
			GrayskullErrorCode.InvalidEmailAddress,
			`No user account found associated with ${emailAddress}`
		)
	}

	const passwordMatch = await compare(password, userAccount.passwordHash)
	if (!passwordMatch) {
		throw new GrayskullError(GrayskullErrorCode.IncorrectPassword, `Password was not correct`)
	}

	if (context.configuration.Security.multifactorRequired && !userAccount.otpEnabled) {
		throw new GrayskullError(
			GrayskullErrorCode.MultifactorRequired,
			`Multifactor authentication is required, but not configured for user ${userAccount.userAccountId}`
		)
	}

	if (userAccount.otpEnabled && userAccount.otpSecret) {
		if (otpToken) {
			const otpSecret = decrypt(userAccount.otpSecret)
			if (!otpSecret) {
				throw new GrayskullError(GrayskullErrorCode.NotAuthorized, `Failed to decrypt otp secret`)
			} else {
				if (
					!otplib.authenticator.check(otpToken, otpSecret) &&
					!(await verifyBackupMultifactorCode(emailAddress, otpToken, context.dataContext))
				) {
					throw new GrayskullError(GrayskullErrorCode.InvalidOTP, `Token is incorrect`)
				}
			}
		} else {
			throw new GrayskullError(GrayskullErrorCode.RequiresOTP, `Login requires OTP`)
		}

		await clearBackupMultifactorCode(emailAddress, context.dataContext)
	}
	const session = await createSession(
		{
			userAccountId: userAccount.userAccountId,
			ipAddress: context.req.socket.remoteAddress
		},
		extendedSession,
		context.dataContext
	)
	if (session) {
		return session
	} else {
		throw new Error('Failed to retrieve session from database')
	}
}
