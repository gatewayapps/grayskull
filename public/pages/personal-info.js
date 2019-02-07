import React from 'react'
import AuthenticatedRoute from '../layouts/authenticatedRoute'

const PersonalInformationPage = () => {
  return (
    <AuthenticatedRoute>
      <div className="jumbotron">I am the personal info page!</div>
    </AuthenticatedRoute>
  )
}

export default PersonalInformationPage
