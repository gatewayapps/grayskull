import { ApolloServer, AuthenticationError } from 'apollo-server-micro'
import { addMiddleware } from 'graphql-add-middleware'
import { schema } from '../../communication/graphql/graphql'
import { prepareContext } from '../../context/prepareContext'

const checkAnonymous = async (root, args, context, info, next) => {
  if (info.parentType && info.parentType._fields && info.parentType._fields[info.fieldName]) {
    if (!context.user && !info.parentType._fields[info.fieldName].allowAnonymous) {
      throw new AuthenticationError('You must be signed in to do that')
    }
  }

  return next()
}

addMiddleware(schema, 'Mutation', checkAnonymous)
addMiddleware(schema, 'Query', checkAnonymous)

const apolloServer = new ApolloServer({
  schema,

  context: async (args) => {
    return await prepareContext(args.req, args.res)
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

const apolloHandler: any = apolloServer.createHandler({ path: '/api/graphql' })
export default apolloHandler
