import { GrayskullError } from '../../../foundation/errors/GrayskullError'
import { IAuthorizeClientResponse } from '../../../foundation/models/IAuthorizeClientResponse'
import { ILoginResponse } from '../../../foundation/models/ILoginResponse'
import { IRegisterUserResponse } from '../../../foundation/models/IRegisterUserResponse'
import AuthenticationService from '../../../server/api/services/AuthenticationService'
import EmailAddressService from '../../../server/api/services/EmailAddressService'
import UserAccountService from '../../../server/api/services/UserAccountService'
import { setAuthCookies, doLogout } from '../../../operations/logic/authentication'
import UserClientService from '../../../server/api/services/UserClientService'
import { verifyPassword } from '../../../operations/data/userAccount/verifyPassword'
import { verifyPasswordStrength } from '../../../operations/logic/verifyPasswordStrength'

import { IOperationResponse } from '../../../foundation/models/IOperationResponse'

import UserAccountRepository from '../../../server/data/repositories/UserAccountRepository'
import TokenService from '../../../server/api/services/TokenService'
import ClientRepository from '../../../server/data/repositories/ClientRepository'
import { ScopeMap } from '../../../server/api/services/ScopeService'

import EmailAddressRepository from '../../../server/data/repositories/EmailAddressRepository'
import { encrypt } from '../../../operations/logic/encryption'
import { Permissions } from '../../../foundation/constants/permissions'
import { IRequestContext } from '../../../foundation/context/prepareContext'
import { sendResetPasswordEmail } from '../../../activities/sendResetPasswordEmail'
import { changePasswordWithToken } from '../../../activities/changePasswordWithToken'
import { changePasswordWithOldPassword } from '../../../activities/changePasswordWithOldPassword'
import { validateResetPasswordToken } from '../../../activities/validateResetPasswordToken'
import { verifyEmailAddress } from '../../../activities/verifyEmailAddress'
import { registerUser } from '../../../activities/registerUser'
import SessionService from '../../../server/api/services/SessionService'

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
    userAccounts: async (obj, args, context: IRequestContext) => {
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
    userAccountsMeta: async (obj, args, context: IRequestContext) => {
      // insert your userAccountsMeta implementation here

      if (context.user?.permissions === Permissions.Admin) {
        return await UserAccountRepository.userAccountsMeta(null, { userContext: context.user })
      } else {
        throw new Error('You must be an administrator to do that')
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
    login: async (obj, args, context: IRequestContext): Promise<ILoginResponse> => {
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
              userContext: context.user
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
    validateResetPasswordToken: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
      const token = args.data.token
      const emailAddress = args.data.emailAddress
      const isValid = await validateResetPasswordToken(emailAddress, token, context)
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
    authorizeClient: async (obj, args, context: IRequestContext): Promise<IAuthorizeClientResponse> => {
      try {
        if (!context.user) {
          throw new Error('You must be logged in')
        }

        const serviceOptions = { userContext: context.user }

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
            nonce
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
          queryParts.expires_in = config.Security.accessTokenExpirationSeconds
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
    updateClientScopes: async (obj, args, context: IRequestContext) => {
      if (!context.user) {
        throw new Error('You must be logged in!')
      }
      const serviceOptions = { userContext: context.user }
      const { client_id, allowedScopes, deniedScopes } = args.data
      await UserClientService.updateScopes(context.user, client_id, allowedScopes, deniedScopes, serviceOptions)
      return true
    },
    validatePassword: () => {
      // insert your validatePassword implementation here
      throw new Error('validatePassword is not implemented')
    },
    changePassword: async (obj, args, context: IRequestContext) => {
      // insert your changePassword implementation here

      const { emailAddress, token, newPassword, confirmPassword, oldPassword } = args.data
      try {
        if (token) {
          //reset password token flow
          await changePasswordWithToken(emailAddress, token, newPassword, context)
        } else {
          //manually change password flow
          await changePasswordWithOldPassword(oldPassword, newPassword, confirmPassword, context)
        }
        return {
          success: true
        }
      } catch (err) {
        console.error(err)
        return {
          success: false,
          error: err.message,
          message: err.message
        }
      }
    },
    resetPassword: async (obj, args, context: IRequestContext) => {
      // insert your resetPassword implementation here
      try {
        await sendResetPasswordEmail(args.data.emailAddress, context)
      } catch (err) {
        console.error(err)
      } finally {
        // We return true no matter what to prevent fishing for email addresses
        return true
      }
    },
    createUser: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
      const userAccount = context.user
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
    update: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
      const userAccount = context.user
      let result: IOperationResponse
      if (!context.user) {
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
    verifyAuthorizationRequest: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
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
    verifyEmailAddress: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
      try {
        await verifyEmailAddress(args.data.emailAddress, args.data.code, context)
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
    registerUser: async (obj, args, context: IRequestContext): Promise<IRegisterUserResponse> => {
      try {
        // eslint-disable-next-line @typescript-eslint/camelcase
        // eslint-disable-next-line no-unused-vars
        const { client_id, confirm, emailAddress, password, ...userInfo } = args.data
        const userAccount = await registerUser(userInfo, emailAddress, password, context)

        const fingerprint = context.req.headers['x-fingerprint'].toString()
        if (fingerprint) {
          await SessionService.createSession(
            {
              fingerprint,
              userAccountId: userAccount.userAccountId!,
              ipAddress: context.req.socket.remoteAddress
            },
            false,
            {}
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
    setOtpSecret: async (obj, args, context: IRequestContext) => {
      if (!context.user) {
        throw new Error('You must be signed in to do that')
      } else {
        try {
          const config = context.configuration

          const passwordValid = await verifyPassword(
            context.user.userAccountId,
            args.data.password,
            context.dataContext
          )
          if (!passwordValid) {
            return {
              success: false,
              message: 'Your password is not correct'
            }
          }

          if (!args.data.otpSecret && config.Security.multifactorRequired) {
            return {
              success: false,
              message: `${config.Server.realmName} security policy requires you to have an Authenticator App configured`
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
    generateMfaKey: (obj, args, context: IRequestContext) => {
      return AuthenticationService.generateOtpSecret(args.data.emailAddress, context.configuration)
    },
    verifyMfaKey: (obj, args) => {
      return AuthenticationService.verifyOtpToken(args.data.secret, args.data.token)
    },
    resendVerification: async (obj, args, context: IRequestContext) => {
      const result = await EmailAddressService.sendVerificationEmail(args.data.emailAddress, context.configuration, {
        userContext: context.user
      })
      return !!result
    },
    resendAllVerificationEmails: async (obj, args, context: IRequestContext) => {
      const unverifiedEmails = await EmailAddressRepository.getEmailAddresses(
        { primary_equals: true, verified_equals: false },
        { userContext: context.user }
      )
      await Promise.all(
        unverifiedEmails.map(async (e) => {
          await EmailAddressService.sendVerificationEmail(e.emailAddress, context.configuration, {
            userContext: context.user
          })
        })
      )

      return true
    },
    deleteAccount: async (obj, args, context: IRequestContext) => {
      const userAccount = context.user
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
    sendBackupCode: async (obj, args, context: IRequestContext) => {
      return await AuthenticationService.sendBackupCode(args.data.emailAddress, context.configuration, {
        userContext: context.user
      })
    },
    activateAccount: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
      const { emailAddress, token, password, confirmPassword } = args.data
      if (!(await UserAccountService.validateResetPasswordToken(emailAddress, token, context.dataContext))) {
        return {
          success: false,
          message: 'Invalid email address or token'
        }
      }
      if (password !== confirmPassword) {
        return {
          success: false,
          message: 'Password does not match confirm password'
        }
      } else {
        const validationResult = await verifyPasswordStrength(password, context.configuration.Security)
        if (validationResult.success) {
          return {
            success: true
          }
        } else {
          return {
            success: false,
            message: validationResult.validationErrors?.join('\n')
          }
        }
      }
    },
    logout: async (obj, args, context: IRequestContext): Promise<IOperationResponse> => {
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
    emailAddress: async (obj, args, context: IRequestContext) => {
      const result = await EmailAddressRepository.getEmailAddresses(
        { primary_equals: true, userAccountId_equals: obj.userAccountId },
        { userContext: context.user }
      )
      if (result.length > 0) {
        return result[0].emailAddress
      } else {
        return null
      }
    }
  },
  UserAccount: {
    emailAddresses: async (obj, args, context: IRequestContext) => {
      return await EmailAddressService.getEmailAddresses(
        { userAccountId_equals: obj.userAccountId },
        { userContext: context.user }
      )
    },
    emailAddress: async (obj, args, context: IRequestContext) => {
      const result = await EmailAddressRepository.getEmailAddresses(
        { primary_equals: true, userAccountId_equals: obj.userAccountId },
        { userContext: context.user }
      )
      if (result.length > 0) {
        return result[0].emailAddress
      } else {
        return null
      }
    }
  }
}
