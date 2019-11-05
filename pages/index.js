import React from 'react'
import AuthenticatedRoute from '../client/layouts/authenticatedRoute'
import UserContext from '../client/contexts/UserContext'
import { ensureSetup } from '../client/utils/ensureSetup'
const HomePage = () => {
  return (
    <AuthenticatedRoute>
      <UserContext.Consumer>
        {({ user }) => (
          <div className="jumbotron">
            I am {user.firstName}
            &apos;s home page!
          </div>
        )}
      </UserContext.Consumer>
    </AuthenticatedRoute>
  )
}

export default ensureSetup(HomePage)
