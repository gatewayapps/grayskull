import { GrayskullError } from '@/GrayskullError'
import { IAuthorizeClientResponse } from '@data/models/IAuthorizeClientResponse'
import { ILoginResponse } from '@data/models/ILoginResponse'
import { IRegisterUserResponse } from '@data/models/IRegisterUserResponse'
import AuthenticationService from '@services/AuthenticationService'
import EmailAddressService from '@services/EmailAddressService'
import UserAccountService from '@services/UserAccountService'
import { setAuthCookies } from '@/utils/authentication'

export default {
  Query: {
    userAccounts: (obj, args, context, info) => {
      // Insert your userAccounts implementation here
      throw new Error('userAccounts is not implemented')
    },
    userAccountsMeta: (obj, args, context, info) => {
      // Insert your userAccountsMeta implementation here
      throw new Error('userAccountsMeta is not implemented')
    },
    userAccount: (obj, args, context, info) => {
      // Insert your userAccount implementation here
      throw new Error('userAccount is not implemented')
    }
  },
  Mutation: {
    login: async (obj, args, context, info): Promise<ILoginResponse> => {
      const {
        emailAddress,
        password,
        otpToken,
        fingerprint
      } = args.data

      try {
        if (!fingerprint) {
          throw new Error('Invalid login request')
        } else {
          const authResult = await AuthenticationService.authenticateUser(emailAddress, password, fingerprint, context.req.ip, otpToken)
          if (authResult.session) {
            setAuthCookies(context.res, authResult.session)

            return {
              success: true,
            }
          } else {
            return {
              success: authResult.success,
              message: authResult.message,
              otpRequired: authResult.otpRequired,
            }
          }
        }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    validatePassword: (obj, args, context, info) => {
      // Insert your validatePassword implementation here
      throw new Error('validatePassword is not implemented')
    },
    changePassword: (obj, args, context, info) => {
      // Insert your changePassword implementation here
      throw new Error('changePassword is not implemented')
    },
    resetPassword: (obj, args, context, info) => {
      // Insert your resetPassword implementation here
      throw new Error('resetPassword is not implemented')
    },
    registerUser: async (obj, args, context, info): Promise<IRegisterUserResponse> => {
      try {
        const { client_id, confirm, emailAddress, password, ...userInfo } = args.data

        await AuthenticationService.validatePassword(password, confirm)
        const userAccount = await UserAccountService.registerUser(userInfo, emailAddress, password)
        return { success: true }
      } catch (err) {
        if (err instanceof GrayskullError) {
          return { success: false, error: err.code, message: err.message }
        }
        return { success: false, message: err.message }
      }
    },
    generateMfaKey: (obj, args, context, info) => {
      return AuthenticationService.generateOtpSecret(args.data.emailAddress)
    },
    verifyMfaKey: (obj, args, context, info) => {
      return AuthenticationService.verifyOtpToken(args.data.secret, args.data.token)
    },
    sendBackupCode: async (obj, args, context, info) => {
      return await AuthenticationService.sendBackupCode(args.data.emailAddress)
    }
  },
  UserAccount: {
    emailAddresses: async (obj, args, context, info) => {
      return await EmailAddressService.getEmailAddresses({ userAccountId_equals: obj.userAccountId })
    }
  }
}
