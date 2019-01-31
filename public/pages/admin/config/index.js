import React from 'react'
import AuthenticatedRoute from '../../../layouts/authenticatedRoute'


const HomePage = () => {
  return (
    <AuthenticatedRoute>
      <div className='jumbotron'>I am the home page!</div>
    </AuthenticatedRoute>
  )
}

export default HomePage
