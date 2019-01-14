import AuthenticationService from '@services/AuthenticationService'
import EmailAddressService from '@services/EmailAddressService'
import UserAccountService from '@services/UserAccountService'
import { GrayskullError } from '@/GrayskullError'
import { IRegisterUserResponse } from '@data/models/IRegisterUserResponse'

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
    login: async (obj, args, context, info) => {
      const {
        emailAddress,
        password,
        otpToken,
        sessionId,
        client_id,
        response_type,
        redirect_uri,
      } = args.data

      try {
        if (response_type !== 'code') {
          throw new Error('Invalid login Request')
        }
        if (!await AuthenticationService.validateRedirectUri(client_id, redirect_uri)) {
          throw new Error('Invalid login request')
        } else if (!sessionId) {
          throw new Error('Invalid login request')
        } else {
          const authResult = await AuthenticationService.authenticateUser(emailAddress, password, sessionId, client_id, otpToken)
          if (authResult.success === true) {
            const queryParts = [`code=${authResult.code}`]
            if (args.data.state) {
              queryParts.push(`state=${args.data.state}`)
            }
            return {
              success: true,
              redirectUrl: `${redirect_uri}?${queryParts.join('&')}`
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
