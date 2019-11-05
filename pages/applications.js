import React from 'react'
import AuthenticatedRoute from '../client/layouts/authenticatedRoute'

const ApplicationsPage = () => {
  return (
    <AuthenticatedRoute>
      <div className="jumbotron">I am the applications page!</div>
    </AuthenticatedRoute>
  )
}

export default ApplicationsPage
