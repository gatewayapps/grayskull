import React from 'react'
import AuthenticatedRoute from '../layouts/authenticatedRoute'
import SecurityPasswordStatus from '../components/SecurityPasswordStatus'
import UserContext from '../contexts/UserContext'
const SecurityPage = () => {
  return (
    <AuthenticatedRoute>
      <UserContext.Consumer>
        {({ user, refresh }) => {
          return (
            <div className="container pt-4">
              <div className="row">
                <div className="col-12 col-lg-10 offset-lg-1">
                  <SecurityPasswordStatus user={user} refresh={refresh} />
                </div>
              </div>
            </div>
          )
        }}
      </UserContext.Consumer>
    </AuthenticatedRoute>
  )
}

export default SecurityPage
