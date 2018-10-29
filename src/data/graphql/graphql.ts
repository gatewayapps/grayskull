import { makeExecutableSchema } from 'apollo-server'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'

const typeDefs = mergeTypes(fileLoader(`${__dirname}/**/*.graphql`, { recursive: true }))
const resolvers = mergeResolvers(fileLoader(`${__dirname}/**/resolvers.ts`, { recursive: true }))

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
