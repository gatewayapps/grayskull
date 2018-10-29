import { makeExecutableSchema } from 'apollo-server'
import { fileLoader, mergeResolvers, mergeTypes } from 'merge-graphql-schemas'

const resolverFilename = process.env.NODE_ENV === 'development' ? 'resolvers.ts' : 'resolvers.js'

const typeDefs = mergeTypes(fileLoader(`${__dirname}/**/*.graphql`, { recursive: true }))
const resolvers = mergeResolvers(fileLoader(`${__dirname}/**/${resolverFilename}`, { recursive: true }))

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
