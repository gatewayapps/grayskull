import ConfigurationManager from '@/config/ConfigurationManager'
import AuthenticationService from '@services/AuthenticationService'
import UserAccountService from '@services/UserAccountService'
import * as otplib from 'otplib'

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
    login: (obj, args, context, info) => {
      // Insert your login implementation here
      throw new Error('login is not implemented')
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
    registerUser: async (obj, args, context, info) => {
      const { confirm, cpt, password, otpSecret, ...userInfo } = args.data

      if (!UserAccountService.validateCPT(cpt)) {
        throw new Error('CPT is not valid')
      }

      await AuthenticationService.validatePassword(password, confirm)
      const { client } = await UserAccountService.registerUser(userInfo, password, cpt, otpSecret)
      return `/auth?client_id=${client!.client_id}&response_type=code&redirect_uri=${escape(client!.redirectUri)}`
    },
    generateMfaKey: (obj, args, context, info) => {
      const secret = otplib.authenticator.generateSecret()
      return otplib.authenticator.keyuri(args.data.emailAddress, ConfigurationManager.General.realmName, secret)
    },
    verifyMfaKey: (obj, args, context, info) => {
      return otplib.authenticator.verify(args.data)
    }
  },
  UserAccount: {}
}
