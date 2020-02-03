import React from 'react'
import AuthenticatedRoute from '../presentation/layouts/authenticatedRoute'
import EditableUserProfile from '../presentation/components/EditableUserProfile'
import UserContext from '../presentation/contexts/UserContext'
import EditableEmailList from '../presentation/components/EditableEmailList'
const PersonalInformationPage = () => {
  return (
    <AuthenticatedRoute>
      <UserContext.Consumer>
        {({ user }) => {
          return (
            <div className="container pt-4">
              <div className="row">
                <div className="col-12 ">
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
