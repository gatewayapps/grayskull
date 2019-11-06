import { ApolloServer } from 'apollo-server-micro'
import { getContext } from '../../server/data/context'
getContext()

import { schema } from '../../server/data/graphql/graphql'
import Cookies from 'cookies'
import { GRAYSKULL_GLOBAL_SECRET } from '../../server/utils/environment'
import { getUserContext } from '../../server/middleware/authentication'
import { buildContext } from '../../server/utils/authentication'

const apolloServer = new ApolloServer({
  schema,

  context: async (args) => {
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
