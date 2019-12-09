import React from 'react'
import AuthenticatedRoute from '../client/layouts/authenticatedRoute'
import UserContext from '../client/contexts/UserContext'

const HomePage = () => {
  return (
    <AuthenticatedRoute>
      <UserContext.Consumer>{({ user }) => <div className="jumbotron">Redirecting...</div>}</UserContext.Consumer>
    </AuthenticatedRoute>
  )
}

HomePage.getInitialProps = (ctx) => {
  // if (ctx.res) {
  //   ctx.res.writeHead(302, {
  //     Location: '/personal-info'
  //   })
  //   ctx.res.end()
  // } else {
  //   window.location.href = '/personal-info'
  // }
  return {}
}

export default HomePage
