import { GrayskullError } from '../../../GrayskullError'
import { IAuthorizeClientResponse } from '../../../data/models/IAuthorizeClientResponse'
import { ILoginResponse } from '../../../data/models/ILoginResponse'
import { IRegisterUserResponse } from '../../../data/models/IRegisterUserResponse'
import AuthenticationService from '../../../api/services/AuthenticationService'
import EmailAddressService from '../../../api/services/EmailAddressService'
import UserAccountService from '../../../api/services/UserAccountService'
import { setAuthCookies, doLogout } from '../../../utils/authentication'
import UserClientService from '../../../api/services/UserClientService'
import SessionService from '../../../api/services/SessionService'

import _ from 'lodash'

import { IQueryOptions } from '../../../data/IQueryOptions'
import { IOperationResponse } from '../../../data/models/IOperationResponse'
import { UserAccount } from '../../../data/models/UserAccount'
import UserAccountRepository from '../../../data/repositories/UserAccountRepository'
import TokenService from '../../../api/services/TokenService'
import ClientRepository from '../../../data/repositories/ClientRepository'
import { ScopeMap } from '../../../api/services/ScopeService'

import EmailAddressRepository from '../../../data/repositories/EmailAddressRepository'
import { encrypt } from '../../../utils/cipher'
import { Permissions } from '../../../utils/permissions'
import { IRequestContext } from '../../../../context/prepareContext'

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
    userAccounts: async (obj, args, context: IRequestContext, info) => {
      // insert your userAccounts implementation here
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      } else {
        if (context.user.permissions < Permissions.Admin) {
          throw new Error('You must be an administrator to do that')
        } else {
          return await UserAccountRepository.getUserAccounts(null, {
            userContext: context.user,
            order: [
              ['lastName', 'asc'],
              ['firstName', 'asc']
            ]
          })
        }
      }
    },
    userAccountsMeta: async (obj, args, context: IRequestContext, info) => {
      // insert your userAccountsMeta implementation here

      if (context.user?.permissions === Permissions.Admin) {
        return await UserAccountRepository.userAccountsMeta(null, { userContext: context.user })
      } else {
        throw new Error('You must be an administrator to do that')
      }
    },
    userAccount: (obj, args, context: IRequestContext, info) => {
      // insert your userAccount implementation here
      throw new Error('userAccount is not implemented')
    },
    me: (obj, args, context: IRequestContext, info) => {
      if (context.user && context.user.birthday && !isValidDate(context.user.birthday)) {
        delete context.user.birthday
      }
      return context.user
    }
  },
  Mutation: {
    login: async (obj, args, context: IRequestContext, info): Promise<ILoginResponse> => {
      const { emailAddress, password, otpToken, fingerprint, extendedSession } = args.data
      try {
        if (!fingerprint) {
          throw new Error('Invalid login request')
        } else {
          const authResult = await AuthenticationService.authenticateUser(
            emailAddress,
            password,
            fingerprint,
            context.req.client.remoteAddress,
            otpToken,
            extendedSession,
            {
              userContext: context.user || null
            }
          )
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
    validateResetPasswordToken: async (obj, args, context: IRequestContext, info): Promise<IOperationResponse> => {
      const token = args.data.token
      const emailAddress = args.data.emailAddress
      const isValid = await UserAccountService.validateResetPasswordToken(emailAddress, token, { userContext: null })
      if (isValid) {
        return {
          success: true
        }
      } else {
        return {
          success: false,
          message: 'Invalid email address or token'
        }
      }
    },
    authorizeClient: async (obj, args, context: IRequestContext, info): Promise<IAuthorizeClientResponse> => {
      try {
        if (!context.user) {
          throw new Error('You must be logged in')
        }

        const serviceOptions = { userContext: context.user || null }

        const { client_id, responseType, redirectUri, scope, state, nonce } = args.data

        if (await !AuthenticationService.validateRedirectUri(client_id, redirectUri, serviceOptions)) {
          throw new Error('Invalid redirect uri')
        }

        const { approvedScopes, pendingScopes, userClientId } = await UserClientService.verifyScope(
          context.user.userAccountId,
          client_id,
          scope,
          serviceOptions
        )
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
          queryParts.code = await AuthenticationService.generateAuthorizationCode(
            context.user,
            client_id,
            userClientId!,
            approvedScopes!,
            nonce,
            serviceOptions
          )
        }
        if (responseTypes.includes('token')) {
          const config = context.configuration

          queryParts.token = await TokenService.createAccessToken(
            client,
            context.user,
            null,
            context.configuration,
            serviceOptions
          )
          queryParts.token_type = 'Bearer'
          queryParts.expires_in = config.Security!.accessTokenExpirationSeconds
        }
        if (responseTypes.includes('id_token') && approvedScopes.includes(ScopeMap.openid.id)) {
          queryParts.id_token = await TokenService.createIDToken(
            client,
            context.user,
            nonce,
            queryParts.token,
            context.configuration,
            serviceOptions
          )
        }

        const query = Object.keys(queryParts).map((k) => `${k}=${encodeURIComponent(queryParts[k])}`)

        if (state) {
          query.push(`state=${encodeURIComponent(state)}`)
        }

        const result = {
          redirectUri: `${redirectUri}${query.length > 0 ? '?' + query.join('&') : ''}`
        }

        return result
      } catch (err) {
        console.error(err)
        throw err
      }
    },
    updateClientScopes: async (obj, args, context: IRequestContext, info) => {
      if (!context.user) {
        throw new Error('You must be logged in!')
      }
      const serviceOptions = { userContext: context.user || null }
      const { client_id, allowedScopes, deniedScopes } = args.data
      await UserClientService.updateScopes(context.user, client_id, allowedScopes, deniedScopes, serviceOptions)
      return true
    },
    validatePassword: (obj, args, context: IRequestContext, info) => {
      // insert your validatePassword implementation here
      throw new Error('validatePassword is not implemented')
    },
    changePassword: async (obj, args, context: IRequestContext, info) => {
      // insert your changePassword implementation here
      let result: IOperationResponse
      const { emailAddress, token, newPassword, confirmPassword, oldPassword } = args.data
      const userContext: UserAccount = context.user || null

      //  only check token if user is not signed in
      const isTokenValid =
        userContext === null
          ? await UserAccountService.validateResetPasswordToken(emailAddress, token, { userContext })
          : true
      if (!isTokenValid) {
        result = {
          success: false,
          message: 'Invalid email address or token'
        }
      } else {
        try {
          const passwordValid = await AuthenticationService.validatePassword(
            newPassword,
            confirmPassword,
            context.configuration,
            {
              userContext
            }
          )
          if (!userContext) {
            const userAccount = await UserAccountService.getUserAccountByEmailAddress(emailAddress, { userContext })

            await UserAccountService.changeUserPassword(userAccount!.userAccountId!, newPassword, { userContext })
            result = { success: true }
          } else {
            if (newPassword === oldPassword) {
              throw new Error('New password cannot be the same as the old password')
            }

            const passwordVerified = await AuthenticationService.verifyPassword(
              userContext.userAccountId!,
              oldPassword,
              { userContext }
            )
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
    resetPassword: async (obj, args, context: IRequestContext, info) => {
      // insert your resetPassword implementation here

      const options: IQueryOptions = { userContext: context.user || null }
      try {
        await UserAccountService.resetPassword(args.data.emailAddress, context.configuration, options)
        return true
      } catch (err) {
        console.error(err)
        return false
      }
    },
    createUser: async (obj, args, context: IRequestContext, info): Promise<IOperationResponse> => {
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
      await UserAccountService.createUserAccount(userData, emailAddress, context.configuration, context.dataContext, {
        userContext: userAccount
      })

      return { success: true }
    },
    update: async (obj, args, context: IRequestContext, info): Promise<IOperationResponse> => {
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
          const updatedUser = await UserAccountRepository.updateUserAccount(
            { userAccountId: args.data.userAccountId },
            args.data,
            { userContext: userAccount }
          )
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
    verifyAuthorizationRequest: async (obj, args, context: IRequestContext, info): Promise<IOperationResponse> => {
      const validRequest = await AuthenticationService.validateRedirectUri(
        args.data.client_id,
        args.data.redirect_uri,
        { userContext: context.user }
      )
      if (validRequest) {
        return {
          success: true
        }
      } else {
        return {
          success: false,
          message: 'Invalid redirectUri'
        }
      }
    },
    verifyEmailAddress: async (obj, args, context: IRequestContext, info): Promise<IOperationResponse> => {
      try {
        await EmailAddressService.verifyEmailAddress(args.data.emailAddress, args.data.code, { userContext: null })
        return {
          success: true
        }
      } catch (err) {
        return {
          success: false,
          message: err.message
        }
      }
    },
    registerUser: async (obj, args, context: IRequestContext, info): Promise<IRegisterUserResponse> => {
      try {
        const { client_id, confirm, emailAddress, password, ...userInfo } = args.data
        const serviceOptions = { userContext: context.user || null }
        await AuthenticationService.validatePassword(password, confirm, context.configuration, serviceOptions)
        const userAccount = await UserAccountService.registerUser(
          userInfo,
          emailAddress,
          password,
          context.configuration,
          context.dataContext,
          serviceOptions
        )

        const fingerprint = context.req.headers['x-fingerprint'].toString()
        if (fingerprint) {
          const session = await SessionService.createSession(
            {
              fingerprint,
              userAccountId: userAccount.userAccountId!,
              ipAddress: context.req.socket.remoteAddress
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
    setOtpSecret: async (obj, args, context: IRequestContext, info) => {
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      } else {
        try {
          const config = context.configuration

          const passwordValid = await AuthenticationService.verifyPassword(
            context.user.userAccountId,
            args.data.password,
            { userContext: context.user }
          )
          if (!passwordValid) {
            return {
              success: false,
              message: 'Your password is not correct'
            }
          }

          if (!args.data.otpSecret && config.Security!.multifactorRequired) {
            return {
              success: false,
              message: `${
                config.Server!.realmName
              } security policy requires you to have an Authenticator App configured`
            }
          }

          await UserAccountRepository.updateUserAccount(
            { userAccountId: context.user.userAccountId },
            { otpSecret: args.data.otpSecret ? encrypt(args.data.otpSecret) : '', otpEnabled: !!args.data.otpSecret },
            { userContext: context.user }
          )

          // iN THE FUTURE WE SHOULD EXPIRE ALL SESSIONS HERE

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
    generateMfaKey: (obj, args, context: IRequestContext, info) => {
      return AuthenticationService.generateOtpSecret(args.data.emailAddress, context.configuration)
    },
    verifyMfaKey: (obj, args, context: IRequestContext, info) => {
      return AuthenticationService.verifyOtpToken(args.data.secret, args.data.token, {
        userContext: context.user || null
      })
    },
    resendVerification: async (obj, args, context: IRequestContext, info) => {
      const result = await EmailAddressService.sendVerificationEmail(args.data.emailAddress, context.configuration, {
        userContext: context.user || null
      })
      return !!result
    },
    resendAllVerificationEmails: async (obj, args, context: IRequestContext, info) => {
      const unverifiedEmails = await EmailAddressRepository.getEmailAddresses(
        { primary_equals: true, verified_equals: false },
        { userContext: context.user || null }
      )
      await Promise.all(
        unverifiedEmails.map(async (e) => {
          await EmailAddressService.sendVerificationEmail(e.emailAddress, context.configuration, {
            userContext: context.user || null
          })
        })
      )

      return true
    },
    deleteAccount: async (obj, args, context: IRequestContext, info) => {
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

      if (userAccount.userAccountId === args.data.userAccountId) {
        return {
          success: false,
          message: 'You cannot delete yourself'
        }
      }

      try {
        await UserAccountRepository.updateUserAccount(
          { userAccountId: args.data.userAccountId },
          { isActive: false, deletedBy: userAccount.userAccountId, deletedAt: new Date() },
          { userContext: context.user }
        )
        return { success: true }
      } catch (err) {
        return {
          success: false,
          message: err.message
        }
      }
    },
    sendBackupCode: async (obj, args, context: IRequestContext, info) => {
      return await AuthenticationService.sendBackupCode(args.data.emailAddress, context.configuration, {
        userContext: context.user || null
      })
    },
    activateAccount: async (obj, args, context: IRequestContext, info): Promise<IOperationResponse> => {
      const { emailAddress, token, password, confirmPassword, otpSecret } = args.data
      if (!(await UserAccountService.validateResetPasswordToken(emailAddress, token, { userContext: null }))) {
        return {
          success: false,
          message: 'Invalid email address or token'
        }
      }

      if (
        !(await AuthenticationService.validatePassword(password, confirmPassword, context.configuration, {
          userContext: null
        }))
      ) {
        return {
          success: false,
          message: 'Password does not meet complexity requirements or password and confirm password do not match'
        }
      }

      await UserAccountService.activateAccount(emailAddress, password, context.dataContext, otpSecret)

      return {
        success: true
      }
    },
    logout: async (obj, args, context: IRequestContext, info): Promise<IOperationResponse> => {
      try {
        await doLogout(context.req, context.res)
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
    emailAddress: async (obj, args, context: IRequestContext, info) => {
      const result = await EmailAddressRepository.getEmailAddresses(
        { primary_equals: true, userAccountId_equals: obj.userAccountId },
        { userContext: context.user || null }
      )
      if (result.length > 0) {
        return result[0].emailAddress
      } else {
        return null
      }
    }
  },
  UserAccount: {
    emailAddresses: async (obj, args, context: IRequestContext, info) => {
      return await EmailAddressService.getEmailAddresses(
        { userAccountId_equals: obj.userAccountId },
        { userContext: context.user || null }
      )
    },
    emailAddress: async (obj, args, context: IRequestContext, info) => {
      const result = await EmailAddressRepository.getEmailAddresses(
        { primary_equals: true, userAccountId_equals: obj.userAccountId },
        { userContext: context.user || null }
      )
      if (result.length > 0) {
        return result[0].emailAddress
      } else {
        return null
      }
    }
  }
}
