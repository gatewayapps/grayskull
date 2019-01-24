import { IScope } from '../../data/models/IScope'

const scopes: IScope[] = [
  {
    id: 'openid',
    clientDescription: 'Access a client specific user identifier',
    userDescription: 'Access your user account id',
    required: true
  },
  {
    id: 'profile',
    clientDescription: `Access a user's profile information`,
    userDescription: 'View your profile information such as name and profile image',
    required: false
  },
  {
    id: 'email',
    clientDescription: `Access a user's email address `,
    userDescription: 'View your email address',
    required: false
  }
  // {
  //   id: 'address',
  //   clientDescription: `Access a user's physical address `,
  //   userDescription: 'View your physical address'
  // },
  // {
  //   id: 'phone',
  //   clientDescription: `Access a user's phone number`,
  //   userDescription: 'View your phone number'
  // }
]

class ScopeService {
  getScopes() {
    return scopes.map((scope) => ({ ...scope }))
  }
}

export default new ScopeService()
