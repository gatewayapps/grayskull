import React from 'react'
import AuthenticatedRoute from '../client/layouts/authenticatedRoute'
import SecurityPasswordStatus from '../client/components/SecurityPasswordStatus'
import SecurityMultifactorStatus from '../client/components/SecurityMultiFactorStatus'
import UserContext from '../client/contexts/UserContext'
const SecurityPage = () => {
  return (
    <AuthenticatedRoute>
      <UserContext.Consumer>
        {({ user, refresh }) => {
          return (
            <div className="container pt-4 pb-5">
              <div className="row mb-5">
                <div className="col-12 ">
                  <SecurityPasswordStatus user={user} refresh={refresh} />
                </div>
              </div>
              <div className="row">
                <div className="col-12 ">
                  <SecurityMultifactorStatus user={user} refresh={refresh} />
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
