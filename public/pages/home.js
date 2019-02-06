import React from 'react'
import AuthenticatedRoute from '../layouts/authenticatedRoute'
import UserContext from '../contexts/UserContext'
const HomePage = () => {
  return (
    <AuthenticatedRoute>
      <UserContext.Consumer>
        {({ user }) => (
          <div className="jumbotron">
            I am {user.firstName}
            's home page!
          </div>
        )}
      </UserContext.Consumer>
    </AuthenticatedRoute>
  )
}

export default HomePage
