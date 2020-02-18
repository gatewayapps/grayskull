import { getScopes } from '../../../foundation/constants/scopes'

export default {
  Query: {
    scopes: () => getScopes()
  }
}
