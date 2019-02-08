import React from 'react'
import AuthenticatedRoute from '../layouts/authenticatedRoute'
import EditableUserProfile from '../components/EditableUserProfile'
import UserContext from '../contexts/UserContext'
import EditableEmailList from '../components/EditableEmailList'
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
                  <EditableEmailList style={{ marginTop: '2rem', marginBottom: '4rem' }} />
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
