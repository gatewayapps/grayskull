import ClientService from '@services/ClientService'
import UserAccountService from '@services/UserAccountService'
import UserClientsService from '@services/UserClientsService'
import { makeExecutableSchema } from 'apollo-server'
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { merge } from 'lodash'
import { resolvers as clientResolvers, typeDef as Client } from './types/Client'
import { resolvers as userAccountResolvers, typeDef as UserAccount } from './types/UserAccount'
import { resolvers as userClientsResolvers, typeDef as UserClients } from './types/UserClients'

const Query = `

scalar Date


type Query {
  userAccounts(offset: Int, limit: Int): [UserAccount]
	userAccount(id: ID!): UserAccount
	clients(offset: Int, limit: Int): [Client]
	client(id: ID!): Client
	userClients(offset: Int, limit: Int): [UserClients]
	userClients(id: ID!): UserClients
}
    `

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return value.getTime() // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value) // ast value is always in string format
      }
      return null
    }
  }),
  Query: {
    userAccount: async (parent, { id }, context, info) => await UserAccountService.getUserAccountByuserAccountId(id),
    client: async (parent, { id }, context, info) => await ClientService.getClientByclient_id(id)
  }
}

export const schema = makeExecutableSchema({
  typeDefs: [Query, UserAccount, Client, UserClients],
  resolvers: merge(resolvers, userAccountResolvers, clientResolvers, userClientsResolvers)
})
