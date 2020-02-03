import React from 'react'
import AuthenticatedRoute from '../presentation/layouts/authenticatedRoute'
import SecurityPasswordStatus from '../presentation/components/SecurityPasswordStatus'
import SecurityMultifactorStatus from '../presentation/components/SecurityMultiFactorStatus'
import UserContext from '../presentation/contexts/UserContext'
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
