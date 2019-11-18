import { ApolloServer, AuthenticationError } from 'apollo-server-micro'
import { getContext } from '../../server/data/context'
import { addMiddleware } from 'graphql-add-middleware'
import { buildContext } from '../../server/utils/authentication'
import { schema } from '../../server/data/graphql/graphql'

getContext()

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

  context: async (args, moreArgs) => {
    const { req, res } = args

    const { requestContext, responseContext } = await buildContext(req, res)
    return { req: requestContext, res: responseContext, user: requestContext.user }
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

const apolloHandler: any = apolloServer.createHandler({ path: '/api/graphql' })
export default apolloHandler
