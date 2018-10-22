export const typeDef = `
  type Client {
		client_id: Int!
		name: String!
		logoImageUrl: String
		description: String
		url: String
  }
`

export const resolvers = {
  Client: {}
}
