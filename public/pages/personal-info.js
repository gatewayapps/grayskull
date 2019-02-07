import React from 'react'
import AuthenticatedRoute from '../layouts/authenticatedRoute'
import EditableUserProfile from '../components/EditableUserProfile'
import UserContext from '../contexts/UserContext'
const PersonalInformationPage = () => {
  return (
    <AuthenticatedRoute>
      <UserContext.Consumer>
        {({ user }) => {
          return (
            <div className="container pt-4">
              <div className="row">
                <div className="col-12 col-lg-10 offset-lg-1">
                  <EditableUserProfile user={user} />
                </div>
              </div>
            </div>
          )
        }}
      </UserContext.Consumer>
    </AuthenticatedRoute>
  )
}

export default PersonalInformationPage
