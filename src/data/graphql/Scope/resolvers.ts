import ScopeService from '@services/ScopeService'

export default {
  Query: {
    scopes: (obj, args, context, info) => {
      return ScopeService.getScopes()
    }
  }
}
