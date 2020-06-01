import { doLogout } from '../../../operations/logic/authentication'

import { IOperationResponse } from '../../../foundation/models/IOperationResponse'

import { IRequestContext } from '../../../foundation/context/prepareContext'

import { registerUserResolver } from './registerUserResolver'
import { verifyEmailAddressResolver } from './verifyEmailAddressResolver'
import { resetPasswordResolver } from './resetPasswordResolver'
import { changePasswordResolver } from './changePasswordResolver'
import { validateResetPasswordTokenResolver } from './validateResetPasswordTokenResolver'
import { loginResolver } from './loginResolver'
import { generateMfaKeyResolver } from './generateMfaKeyResolver'
import { verifyAuthorizationRequestResolver } from './verifyAuthorizationRequestResolver'

import { authorizeClientResolver } from './authorizeClientResolver'
import { sendEmailVerificationActivity } from '../../../activities/sendEmailVerificationActivity'
import { verifyOtpTokenActivity } from '../../../activities/verifyOtpTokenActivity'

import { createUserAccountActivity } from '../../../activities/admin/createUserAccountActivity'

import { activateAccountResolver } from './activateAccountResolver'
import { listUserAccountEmailAddressesActivity } from '../../../activities/listUserAccountEmailAddressesActivity'

import { updateClientScopesResolver } from './updateClientScopesResolver'

import { resendAllVerificationEmailsActivity } from '../../../activities/admin/resendAllVerificationEmailsActivity'
import { getUserAccountsActivity } from '../../../activities/admin/getUserAccountsActivity'
import { setOTPSecretActivity } from '../../../activities/setOTPSecretActivity'
import { deleteUserAccountActivity } from '../../../activities/admin/deleteUserAccountActivity'
import { updateUserAccountActivity } from '../../../activities/updateUserAccountActivity'
import { getPrimaryEmailAddressForLoggedInUserActivity } from '../../../activities/getPrimaryEmailAddressForLoggedInUserActivity'
import { getPrimaryEmailAddressForUserActivity } from '../../../activities/getPrimaryEmailAddressForUserActivity'

function isValidDate(d: any) {
	try {
		return d instanceof Date && !isNaN(d.getTime())
	} catch (err) {
		return false
	}
}

export default {
	Query: {
		userAccounts: async (obj, args, context: IRequestContext) => {
			return getUserAccountsActivity(context)
		},
		userAccountsMeta: async (obj, args, context: IRequestContext) => {
			// insert your userAccountsMeta implementation here
			const result = await getUserAccountsActivity(context)
			return {
				count: result.length
			}
		},
		userAccount: () => {
			// insert your userAccount implementation here
			throw new Error('userAccount is not implemented')
		},
		me: (obj, args, context: IRequestContext) => {
			if (context.user && context.user.birthday && !isValidDate(context.user.birthday)) {
				delete context.user.birthday
			}
			return context.user
		}
	},
	Mutation: {
		login: loginResolver,
		validateResetPasswordToken: validateResetPasswordTokenResolver,
		authorizeClient: authorizeClientResolver,
		updateClientScopes: updateClientScopesResolver,
		validatePassword: () => {
			// insert your validatePassword implementation here
			throw new Error('validatePassword is not implemented')
		},
		changePassword: changePasswordResolver,
		resetPassword: resetPasswordResolver,
		createUser: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
			const { emailAddress, ...userData } = args.data

			await createUserAccountActivity(userData, emailAddress, context)

			return { success: true }
		},
		update: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
			await updateUserAccountActivity(args.data.userAccountId, args.data, context)
			return {
				success: true
			}
		},
		verifyAuthorizationRequest: verifyAuthorizationRequestResolver,
		verifyEmailAddress: verifyEmailAddressResolver,
		registerUser: registerUserResolver,
		setOtpSecret: async (obj, args, context: IRequestContext) => {
			const { password, otpSecret } = args.data
			await setOTPSecretActivity(password, otpSecret, context)
			return {
				success: true
			}
		},
		generateMfaKey: generateMfaKeyResolver,
		verifyMfaKey: async (obj, args) => {
			return await verifyOtpTokenActivity(args.data.secret, args.data.token)
		},
		resendVerification: async (obj, args, context: IRequestContext) => {
			await sendEmailVerificationActivity(args.data.emailAddress, context)
			return true
		},
		resendAllVerificationEmails: async (obj, args, context: IRequestContext) => {
			await resendAllVerificationEmailsActivity(context)
			return true
		},
		deleteAccount: async (obj, args, context: IRequestContext) => {
			await deleteUserAccountActivity(args.data.userAccountId, context)
			return { success: true }
		},
		activateAccount: activateAccountResolver,
		logout: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
			try {
				await doLogout(context)
				return {
					success: true
				}
			} catch (err) {
				return {
					success: false,
					message: err.message
				}
			}
		}
	},
	UserProfile: {
		emailAddress: async (obj, args, context: IRequestContext) => {
			return await getPrimaryEmailAddressForLoggedInUserActivity(context)
		}
	},
	UserAccount: {
		emailAddresses: async (obj, args, context: IRequestContext) => {
			return listUserAccountEmailAddressesActivity(obj.userAccountId, context)
		},
		emailAddress: async (obj, args, context: IRequestContext) => {
			return getPrimaryEmailAddressForUserActivity(obj.userAccountId, context)
		}
	}
}
