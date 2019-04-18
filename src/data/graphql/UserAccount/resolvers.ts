import { GrayskullError } from '@/GrayskullError'
import { IAuthorizeClientResponse } from '@data/models/IAuthorizeClientResponse'
import { ILoginResponse } from '@data/models/ILoginResponse'
import { IRegisterUserResponse } from '@data/models/IRegisterUserResponse'
import AuthenticationService from '@services/AuthenticationService'
import EmailAddressService from '@services/EmailAddressService'
import UserAccountService from '@services/UserAccountService'
import { setAuthCookies } from '@/utils/authentication'
import UserClientService from '@services/UserClientService'
import SessionService from '@services/SessionService'

import _ from 'lodash'

import { IQueryOptions } from '@data/IQueryOptions'
import { IOperationResponse } from '@data/models/IOperationResponse'
import { IUserAccount } from '@data/models/IUserAccount'
import UserAccountRepository from '@data/repositories/UserAccountRepository'
import TokenService from '@services/TokenService'
import ClientRepository from '@data/repositories/ClientRepository'
import { ScopeMap } from '@services/ScopeService'
import ConfigurationManager from '@/config/ConfigurationManager'
import EmailAddressRepository from '@data/repositories/EmailAddressRepository'
import { encrypt } from '@/utils/cipher'
import { Permissions } from '@/utils/permissions'

const VALID_RESPONSE_TYPES = ['code', 'token', 'id_token', 'none']

function isValidDate(d: any) {
  try {
    return d instanceof Date && !isNaN(d.getTime())
  } catch (err) {
    return false
  }
}

export default {
  Query: {
    userAccounts: async (obj, args, context, info) => {
      // Insert your userAccounts implementation here
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      } else {
        if (context.user.permissions < Permissions.Admin) {
          throw new Error('You must be an administrator to do that')
        } else {
          return await UserAccountRepository.getUserAccounts(null, { userContext: context.user, order: [['lastName', 'asc'], ['firstName', 'asc']] })
        }
      }
    },
    userAccountsMeta: async (obj, args, context, info) => {
      // Insert your userAccountsMeta implementation here
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      } else {
        if (context.user.permissions < Permissions.Admin) {
          throw new Error('You must be an administrator to do that')
        } else {
          return await UserAccountRepository.userAccountsMeta(null, { userContext: context.user })
        }
      }
    },
    userAccount: (obj, args, context, info) => {
      // Insert your userAccount implementation here
      throw new Error('userAccount is not implemented')
    },
    me: (obj, args, context, info) => {
      if (context.user && context.user.birthday && !isValidDate(context.user.birthday)) {
        delete context.user.birthday
      }
      return context.user
    }
  },
  Mutation: {
    login: async (obj, args, context, info): Promise<ILoginResponse> => {
      const { emailAddress, password, otpToken, fingerprint, extendedSession } = args.data
      try {
        if (!fingerprint) {
          throw new Error('Invalid login request')
        } else {
          const authResult = await AuthenticationService.authenticateUser(emailAddress, password, fingerprint, context.req.ip, otpToken, extendedSession, { userContext: context.user || null })
          if (authResult.session) {
            setAuthCookies(context.res, authResult.session)

            return {
              success: true
            }
          } else {
            return {
              success: authResult.success,
              message: authResult.message,
              otpRequired: authResult.otpRequired,
              emailVerificationRequired: authResult.emailVerificationRequired
            }
          }
        }
      } catch (err) {
        return { success: false, message: err.message }
      }
    },
    authorizeClient: async (obj, args, context, info): Promise<IAuthorizeClientResponse> => {
      if (!context.user) {
        throw new Error('You must be logged in')
      }

      const serviceOptions = { userContext: context.user || null }

      const { client_id, responseType, redirectUri, scope, state, nonce } = args.data

      if (await !AuthenticationService.validateRedirectUri(client_id, redirectUri, serviceOptions)) {
        throw new Error('Invalid redirect uri')
      }

      const { approvedScopes, pendingScopes, userClientId } = await UserClientService.verifyScope(context.user.userAccountId, client_id, scope, serviceOptions)
      if (pendingScopes && pendingScopes.length > 0) {
        return {
          pendingScopes
        }
      }

      const client = await ClientRepository.getClientWithSensitiveData({ client_id }, serviceOptions)
      if (!client) {
        throw new Error('Invalid client_id')
      }
      if (!approvedScopes || approvedScopes.length === 0) {
        throw new Error('You have not approved any scopes')
      }

      const responseTypes: string[] = responseType.split(' ')

      if (!responseTypes.every((rt) => VALID_RESPONSE_TYPES.includes(rt))) {
        throw new Error('Invalid response type')
      }

      const queryParts: any = {}

      if (responseTypes.includes('code')) {
        queryParts['code'] = AuthenticationService.generateAuthorizationCode(context.user, client_id, userClientId!, approvedScopes!, nonce, serviceOptions)
      }
      if (responseTypes.includes('token')) {
        queryParts['token'] = await TokenService.createAccessToken(client, context.user, null, serviceOptions)
        queryParts['token_type'] = 'Bearer'
        queryParts['expires_in'] = ConfigurationManager.Security!.accessTokenExpirationSeconds
      }
      if (responseTypes.includes('id_token') && approvedScopes.includes(ScopeMap.openid.id)) {
        queryParts['id_token'] = await TokenService.createIDToken(client, context.user, nonce, queryParts['token'], serviceOptions)
      }

      const query = Object.keys(queryParts).map((k) => `${k}=${encodeURIComponent(queryParts[k])}`)

      if (state) {
        query.push(`state=${encodeURIComponent(state)}`)
      }

      const result = {
        redirectUri: `${redirectUri}${query.length > 0 ? '?' + query.join('&') : ''}`
      }

      return result
    },
    updateClientScopes: async (obj, args, context, info) => {
      if (!context.user) {
        throw new Error('You must be logged in!')
      }
      const serviceOptions = { userContext: context.user || null }
      const { client_id, allowedScopes, deniedScopes } = args.data
      await UserClientService.updateScopes(context.user, client_id, allowedScopes, deniedScopes, serviceOptions)
      return true
    },
    validatePassword: (obj, args, context, info) => {
      // Insert your validatePassword implementation here
      throw new Error('validatePassword is not implemented')
    },
    changePassword: async (obj, args, context, info) => {
      // Insert your changePassword implementation here
      let result: IOperationResponse
      const { emailAddress, token, newPassword, confirmPassword, oldPassword } = args.data
      const userContext: IUserAccount = context.user || null

      //  Only check token if user is not signed in
      const isTokenValid = userContext === null ? await UserAccountService.validateResetPasswordToken(emailAddress, token, { userContext }) : true
      if (!isTokenValid) {
        result = {
          success: false,
          message: 'Invalid email address or token'
        }
      } else {
        try {
          const passwordValid = await AuthenticationService.validatePassword(newPassword, confirmPassword, { userContext })
          if (!userContext) {
            const userAccount = await UserAccountService.getUserAccountByEmailAddress(emailAddress, { userContext })

            await UserAccountService.changeUserPassword(userAccount!.userAccountId!, newPassword, { userContext })
            result = { success: true }
          } else {
            if (newPassword === oldPassword) {
              throw new Error('New password cannot be the same as the old password')
            }

            const passwordVerified = await AuthenticationService.verifyPassword(userContext.userAccountId!, oldPassword, { userContext })
            if (passwordVerified) {
              await UserAccountService.changeUserPassword(userContext.userAccountId!, newPassword, { userContext })
              result = { success: true }
            } else {
              throw new Error('Current password is not correct')
            }
          }
        } catch (err) {
          result = {
            success: false,
            error: err.message,
            message: err.message
          }
        }
      }
      return result
    },
    resetPassword: async (obj, args, context, info) => {
      // Insert your resetPassword implementation here
      const options: IQueryOptions = { userContext: context.user || null }
      try {
        await UserAccountService.resetPassword(args.data.emailAddress, options)
        return true
      } catch (err) {
        return false
      }
    },
    createUser: async (obj, args, context, info): Promise<IOperationResponse> => {
      const userAccount = context.user
      let result: IOperationResponse
      if (!userAccount) {
        return {
          success: false,
          message: 'You must be signed in to do that'
        }
      }

      if (userAccount.permissions < Permissions.Admin) {
        return {
          success: false,
          message: 'You must be an administrator to do that'
        }
      }

      const { emailAddress, ...userData } = args.data
      await UserAccountService.createUserAccount(userData, emailAddress, { userContext: userAccount })

      return { success: true }
    },
    update: async (obj, args, context, info): Promise<IOperationResponse> => {
      const userAccount = context.user
      let result: IOperationResponse
      if (!userAccount) {
        result = {
          success: false,
          message: 'You must be signed in to do that'
        }
      } else {
        if (context.user.permissions < Permissions.Admin && args.data.permissions !== undefined) {
          throw new Error('You do not have permission to do that')
        }
        if (context.user.permissions < Permissions.Admin && context.user.userAccountId !== args.data.userAccountId) {
          result = {
            success: false,
            message: 'You do not have permission to do that'
          }
        } else {
          const updatedUser = await UserAccountRepository.updateUserAccount({ userAccountId: args.data.userAccountId }, args.data, { userContext: userAccount })
          if (updatedUser) {
            result = {
              success: true
            }
          } else {
            result = {
              success: false,
              message: 'Invalid user account'
            }
          }
        }
      }
      return result
    },
    registerUser: async (obj, args, context, info): Promise<IRegisterUserResponse> => {
      try {
        const { client_id, confirm, emailAddress, password, ...userInfo } = args.data
        const serviceOptions = { userContext: context.user || null }
        await AuthenticationService.validatePassword(password, confirm, serviceOptions)
        const userAccount = await UserAccountService.registerUser(userInfo, emailAddress, password, serviceOptions)

        const fingerprint = context.req.header('x-fingerprint')
        if (fingerprint) {
          const session = await SessionService.createSession(
            {
              fingerprint,
              userAccountId: userAccount.userAccountId!,
              ipAddress: context.req.ip
            },
            false,
            serviceOptions
          )
          // setAuthCookies(context.res, session)
        }
        return {
          success: true,
          message: `Your account has been created and a verification e-mail has been sent to ${emailAddress}.  You must click the link in the message before you can sign in.`
        }
      } catch (err) {
        if (err instanceof GrayskullError) {
          return { success: false, error: err.code, message: err.message }
        }
        return { success: false, message: err.message }
      }
    },
    setOtpSecret: async (obj, args, context, info) => {
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      } else {
        try {
          const passwordValid = await AuthenticationService.verifyPassword(context.user.userAccountId, args.data.password, { userContext: context.user })
          if (!passwordValid) {
            return {
              success: false,
              message: 'Your password is not correct'
            }
          }

          if (!args.data.otpSecret && ConfigurationManager.Security!.multifactorRequired) {
            return {
              success: false,
              message: `${ConfigurationManager.Server!.realmName} security policy requires you to have an Authenticator App configured`
            }
          }

          await UserAccountRepository.updateUserAccount(
            { userAccountId: context.user.userAccountId },
            { otpSecret: args.data.otpSecret ? encrypt(args.data.otpSecret) : '', otpEnabled: !!args.data.otpSecret },
            { userContext: context.user }
          )

          // IN THE FUTURE WE SHOULD EXPIRE ALL SESSIONS HERE

          return {
            success: true
          }
        } catch (err) {
          return {
            success: false,
            error: err.message,
            message: err.message
          }
        }
      }
    },
    generateMfaKey: (obj, args, context, info) => {
      return AuthenticationService.generateOtpSecret(args.data.emailAddress)
    },
    verifyMfaKey: (obj, args, context, info) => {
      return AuthenticationService.verifyOtpToken(args.data.secret, args.data.token, { userContext: context.user || null })
    },
    resendVerification: async (obj, args, context, info) => {
      const result = await EmailAddressService.sendVerificationEmail(args.data.emailAddress, { userContext: context.user || null })
      return !!result
    },
    sendBackupCode: async (obj, args, context, info) => {
      return await AuthenticationService.sendBackupCode(args.data.emailAddress, { userContext: context.user || null })
    }
  },
  UserProfile: {
    emailAddress: async (obj, args, context, info) => {
      const result = await EmailAddressRepository.getEmailAddresses({ primary_equals: true, userAccountId_equals: obj.userAccountId }, { userContext: context.user || null })
      if (result.length > 0) {
        return result[0].emailAddress
      } else {
        return null
      }
    }
  },
  UserAccount: {
    emailAddresses: async (obj, args, context, info) => {
      return await EmailAddressService.getEmailAddresses({ userAccountId_equals: obj.userAccountId }, { userContext: context.user || null })
    },
    emailAddress: async (obj, args, context, info) => {
      const result = await EmailAddressRepository.getEmailAddresses({ primary_equals: true, userAccountId_equals: obj.userAccountId }, { userContext: context.user || null })
      if (result.length > 0) {
        return result[0].emailAddress
      } else {
        return null
      }
    }
  }
}
