import React from 'react'
import AuthenticatedRoute from '../layouts/authenticatedRoute'

const SecurityPage = () => {
  return (
    <AuthenticatedRoute>
      <div className="jumbotron">I am the security page!</div>
    </AuthenticatedRoute>
  )
}

export default SecurityPage
