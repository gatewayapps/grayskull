import { ApolloServer } from 'apollo-server-micro'
import { getContext } from '../../server/data/context'
getContext()

import { schema } from '../../server/data/graphql/graphql'
import Cookies from 'cookies'
import { GRAYSKULL_GLOBAL_SECRET } from '../../server/utils/environment'
import { getUserContext } from '../../server/middleware/authentication'

const apolloServer = new ApolloServer({
  schema,

  context: async (args) => {
    const { req, res } = args

    req.cookies = new Cookies(args.req, args.res)
    res.cookies = req.cookies

    await getUserContext(req, res)

    return { req, res, user: req.user }
  }
})

export const config = {
  api: {
    bodyParser: false
  }
}

const apolloHandler: any = apolloServer.createHandler({ path: '/api/graphql' })
export default apolloHandler
