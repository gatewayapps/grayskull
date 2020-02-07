import AuthenticationService from '../../../server/api/services/AuthenticationService'
import EmailAddressService from '../../../server/api/services/EmailAddressService'
import UserAccountService from '../../../server/api/services/UserAccountService'
import { doLogout } from '../../../operations/logic/authentication'
import UserClientService from '../../../server/api/services/UserClientService'
import { verifyPassword } from '../../../operations/data/userAccount/verifyPassword'
import { verifyPasswordStrength } from '../../../operations/logic/verifyPasswordStrength'
import { IOperationResponse } from '../../../foundation/models/IOperationResponse'
import UserAccountRepository from '../../../server/data/repositories/UserAccountRepository'

import EmailAddressRepository from '../../../server/data/repositories/EmailAddressRepository'
import { encrypt } from '../../../operations/logic/encryption'
import { Permissions } from '../../../foundation/constants/permissions'
import { IRequestContext } from '../../../foundation/context/prepareContext'

import { registerUserResolver } from './registerUserResolver'
import { verifyEmailAddressResolver } from './verifyEmailAddressResolver'
import { resetPasswordResolver } from './resetPasswordResolver'
import { changePasswordResolver } from './changePasswordResolver'
import { validateResetPasswordTokenResolver } from './validateResetPasswordTokenResolver'
import { loginResolver } from './loginResolver'
import { generateMfaKeyResolver } from './generateMfaKeyResolver'
import { sendBackupCodeResolver } from './sendBackupCodeResolver'
import { verifyAuthorizationRequestResolver } from './verifyAuthorizationRequestResolver'

import { authorizeClientResolver } from './authorizeClientResolver'

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

      if (context.user && context.user.permissions === Permissions.Admin) {
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
    login: loginResolver,
    validateResetPasswordToken: validateResetPasswordTokenResolver,
    authorizeClient: authorizeClientResolver,
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
    changePassword: changePasswordResolver,
    resetPassword: resetPasswordResolver,
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
    verifyAuthorizationRequest: verifyAuthorizationRequestResolver,
    verifyEmailAddress: verifyEmailAddressResolver,
    registerUser: registerUserResolver,
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
    generateMfaKey: generateMfaKeyResolver,
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
    sendBackupCode: sendBackupCodeResolver,
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
        if (validationResult.success && !validationResult.validationErrors) {
          return {
            success: true
          }
        } else {
          if (validationResult.validationErrors) {
            return {
              success: false,
              message: validationResult.validationErrors.join('\n')
            }
          }
        }
      }
      return { success: false }
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
