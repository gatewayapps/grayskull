import ScopeService from '../../../server/api/services/ScopeService'

export default {
  Query: {
    scopes: () => ScopeService.getScopes()
  }
}
