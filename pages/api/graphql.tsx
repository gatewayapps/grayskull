import { ApolloServer } from 'apollo-server-micro'
import { getContext } from '../../server/data/context'
getContext()

import { schema } from '../../server/data/graphql/graphql'

const apolloServer = new ApolloServer({ schema })

export const config = {
  api: {
    bodyParser: false
  }
}

export default apolloServer.createHandler({ path: '/api/graphql' })
