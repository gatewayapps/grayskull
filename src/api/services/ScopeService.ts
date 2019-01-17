import { IScope } from '../../data/models/IScope'

const scopes: IScope[] = [
  {
    id: 'read_basic',
    clientDescription: `Read a user's name and profile image`,
    userDescription: 'View your basic profile information such as name and profile image'
  },
  {
    id: 'write_basic',
    clientDescription: `Update a user's name and profile image`,
    userDescription: 'Change your basic profile information such as name and profile image'
  },
  {
    id: 'read_contact',
    clientDescription: `Read a user's contact information such as email address and phone number`,
    userDescription: 'View your contact information such as email address and phone number'
  },
  {
    id: 'write_contact',
    clientDescription: `Update a user's contact information such as email address and phone number`,
    userDescription: 'Change your contact information such as email address and phone number'
  }
]

class ScopeService {
  getScopes() {
    return scopes.map((scope) => ({ ...scope }))
  }
}

export default new ScopeService()
