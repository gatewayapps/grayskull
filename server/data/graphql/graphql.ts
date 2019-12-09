import { makeExecutableSchema } from 'apollo-server'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import { AuthorizationDirective } from './AuthorizationDirective'
import { AnonymousDirective } from './AnonymousDirective'



const typeDefs = mergeTypes(
  fileLoader(`${process.env.PROJECT_ROOT!}/data/*.graphql`, { recursive: true })
)
import baseResolver from './base/resolvers'
import clientResolver from './Client/resolvers'
import configurationResolver from './Configuration/resolvers'
import emailResolver from './EmailAddress/resolvers'
import scopeResolver from './Scope/resolvers'
import userAccountResolver from './UserAccount/resolvers'

const resolvers = mergeResolvers([
  baseResolver as any,
  clientResolver as any,
  configurationResolver as any,
  emailResolver as any,
  scopeResolver as any,
  userAccountResolver as any
])

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthorizationDirective,
    anonymous: AnonymousDirective
  }
})
