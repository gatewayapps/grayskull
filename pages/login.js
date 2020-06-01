import React from 'react'
import { withRouter, default as Router } from 'next/router'
import BackgroundCover from '../presentation/components/BackgroundCover'
import RequireConfiguration from '../presentation/components/RequireConfiguration'
import LoginForm from '../presentation/components/LoginForm'
import Primary from '../presentation/layouts/primary'
import { parseRoutingState } from '../presentation/utils/routing'
import UserContext from '../presentation/contexts/UserContext'

class LoginPage extends React.PureComponent {
	static async getInitialProps({ query, res }) {
		const locals = res ? res.locals : {}
		return { query, ...locals }
	}

	onAuthenticated = async () => {
		await this.refresh()
		if (this.props.router.query.state) {
			const parsedState = parseRoutingState(this.props.router.query.state)
			if (parsedState) {
				this.props.router.push(parsedState)
				return
			}
		}
		Router.push('/')
	}

	render() {
		let headerMessage
		if (this.props && this.props.query && this.props.query.emailVerified) {
			headerMessage = <div className="alert alert-success">E-mail address verified</div>
		}

		return (
			<Primary>
				<BackgroundCover>
					<RequireConfiguration>
						{(configuration) => (
							<div className="container">
								{headerMessage}
								<UserContext.Consumer>
									{({ refresh }) => {
										this.refresh = refresh
										return <LoginForm onAuthenticated={this.onAuthenticated} configuration={configuration} />
									}}
								</UserContext.Consumer>
							</div>
						)}
					</RequireConfiguration>
				</BackgroundCover>
			</Primary>
		)
	}
}

export default withRouter(LoginPage)
