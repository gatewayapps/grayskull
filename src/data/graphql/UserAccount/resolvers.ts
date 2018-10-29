export default {
  Query: {
    userAccounts: (obj, args, context, info) => {
      // Insert your userAccounts implementation here
      throw new Error('userAccounts is not implemented')
    },
    userAccountByEmailAddress: (obj, args, context, info) => {
      // Insert your userAccountByEmailAddress implementation here
      throw new Error('userAccountByEmailAddress is not implemented')
    },
    userAccountByUserAccountId: (obj, args, context, info) => {
      // Insert your userAccountByUserAccountId implementation here
      throw new Error('userAccountByUserAccountId is not implemented')
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
    createUserAccount: (obj, args, context, info) => {
      // Insert your createUserAccount implementation here
      throw new Error('createUserAccount is not implemented')
    }
  },
  UserAccount: {}
}
