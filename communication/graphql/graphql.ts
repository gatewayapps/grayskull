/* eslint-disable @typescript-eslint/no-var-requires */
import { makeExecutableSchema } from 'apollo-server'
import { mergeResolvers, mergeTypes } from 'merge-graphql-schemas'
import { AuthorizationDirective } from './AuthorizationDirective'
import { AnonymousDirective } from './AnonymousDirective'

const graphqlSchema = require('./schema.graphql')
const customSchema = require('./custom.graphql')

const typeDefs = mergeTypes([graphqlSchema, customSchema])
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
