import { IScope } from '../../data/models/IScope'

export const ScopeMap = {
  openid: {
    id: 'openid',
    clientDescription: 'Access a client specific user identifier',
    userDescription: 'Access your user account id',
    required: true
  },
  offline_access: {
    id: 'offline_access',
    clientDescription: 'Provide the client with a refresh token',
    userDescription: 'Keep you signed in',
    required: false
  },
  profile: {
    id: 'profile',
    clientDescription: `Access a user's profile information`,
    userDescription: 'View your profile information such as name and profile image',
    required: false
  },
  email: {
    id: 'email',
    clientDescription: `Access a user's email address `,
    userDescription: 'View your email address',
    required: false
  }
}

export const Scopes: IScope[] = [ScopeMap.openid, ScopeMap.offline_access, ScopeMap.profile, ScopeMap.email]

class ScopeService {
  getScopes() {
    return Scopes.map((scope) => ({ ...scope }))
  }
}

export default new ScopeService()
