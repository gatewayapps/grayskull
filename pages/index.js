import React from 'react'
import AuthenticatedRoute from '../presentation/layouts/authenticatedRoute'
import UserContext from '../presentation/contexts/UserContext'

const HomePage = () => {
	return (
		<AuthenticatedRoute>
			<UserContext.Consumer>{() => <div className="jumbotron">Redirecting...</div>}</UserContext.Consumer>
		</AuthenticatedRoute>
	)
}

HomePage.getInitialProps = () => {
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
