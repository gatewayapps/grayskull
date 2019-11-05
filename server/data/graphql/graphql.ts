import { makeExecutableSchema } from 'apollo-server'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import { AuthorizationDirective } from './AuthorizationDirective'
import getConfig from 'next/config'
import { join } from 'path'
const { serverRuntimeConfig } = getConfig()

const typeDefs = mergeTypes(fileLoader(`${serverRuntimeConfig.PROJECT_ROOT}/server/data/graphql/**/*.graphql`, { recursive: true }))
import baseResolver from './base/resolvers'
import clientResolver from './Client/resolvers'
import configurationResolver from './Configuration/resolvers'
import emailResolver from './EmailAddress/resolvers'
import scopeResolver from './Scope/resolvers'
import userAccountResolver from './UserAccount/resolvers'

const resolvers = mergeResolvers([baseResolver, clientResolver, configurationResolver, emailResolver, scopeResolver, userAccountResolver])

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  schemaDirectives: {
    auth: AuthorizationDirective
  }
})
