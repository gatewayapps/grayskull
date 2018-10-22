export const typeDef = `
  type UserAccount {
		dateCreated: Date!
		emailAddress: String!
		emailVerified: Boolean!
		firstName: String!
		lastActive: Date!
		lastName: String!
		lastPasswordChange: Date!
		phoneNumber: String!
		profileImageUrl: String!
		userAccountId: Int!
		isGlobalAdmin: Boolean!
		isActive: Boolean!
  }
`

export const resolvers = {
  UserAccount: {}
}
