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
      const { emailAddress, password, otpToken, fingerprint } = args.data
      try {
        if (!fingerprint) {
          throw new Error('Invalid login request')
        } else {
          const authResult = await AuthenticationService.authenticateUser(emailAddress, password, fingerprint, context.req.ip, otpToken, { userContext: context.user || null })
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
      const { emailAddress, token, newPassword, confirmPassword } = args.data
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
          AuthenticationService.validatePassword(newPassword, confirmPassword, { userContext })
          if (!userContext) {
            const userAccount = await UserAccountService.getUserAccountByEmailAddress(emailAddress, { userContext })
            await UserAccountService.changeUserPassword(userAccount!.userAccountId!, newPassword, { userContext })
          } else {
            await UserAccountService.changeUserPassword(userContext.userAccountId!, newPassword, { userContext })
          }
          result = { success: true }
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
    update: async (obj, args, context, info): Promise<IOperationResponse> => {
      const userAccount = context.user
      let result: IOperationResponse
      if (!userAccount) {
        result = {
          success: false,
          message: 'You must be signed in to do that'
        }
      } else {
        const updatedUser = await UserAccountRepository.updateUserAccount({ userAccountId: userAccount.userAccountId }, args.data, { userContext: userAccount })
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
  UserAccount: {
    emailAddresses: async (obj, args, context, info) => {
      return await EmailAddressService.getEmailAddresses({ userAccountId_equals: obj.userAccountId }, { userContext: context.user || null })
    }
  }
}
