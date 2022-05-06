import AuthenticatedRoute from '../presentation/layouts/authenticatedRoute'
import EditableEmailList from '../presentation/components/EditableEmailList'
import EditableUserProfile from '../presentation/components/EditableUserProfile'
import React from 'react'
import UserContext from '../presentation/contexts/UserContext'
const PersonalInformationPage = () => {
	return (
		<AuthenticatedRoute>
			<UserContext.Consumer>
				{({ user }) => {
					return (
						<div className="container pt-4">
							<div className="row">
								<div className="col-12 ">
									<EditableUserProfile user={user as any} />
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
