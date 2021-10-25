import React from 'react'

import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { FormValidation, FormValidationRule } from '@gatewayapps/react-form-validation'
import moment from 'moment'
import Permissions from '../utils/permissions'

const DELETE_USER_MUTATION = gql`
	mutation DELETE_USER_MUTATION($userAccountId: String!) {
		deleteAccount(data: { userAccountId: $userAccountId }) {
			success
			message
		}
	}
`

const UPDATE_USER_MUTATION = gql`
	mutation UPDATE_USER_MUTATION(
		$firstName: String
		$lastName: String
		$displayName: String
		$gender: String
		$birthday: Date
		$profileImageUrl: String
		$userAccountId: String
		$permissions: Int
		$password: String
	) {
		update(
			data: {
				firstName: $firstName
				lastName: $lastName
				displayName: $displayName
				gender: $gender
				birthday: $birthday
				profileImageUrl: $profileImageUrl
				userAccountId: $userAccountId
				permissions: $permissions
				password: $password
			}
		) {
			success
			message
		}
	}
`

const CREATE_USER_MUTATION = gql`
	mutation CREATE_USER_MUTATION(
		$firstName: String!
		$lastName: String!
		$displayName: String
		$gender: String
		$birthday: Date
		$profileImageUrl: String
		$permissions: Int!
		$emailAddress: String!
		$password: String
	) {
		createUser(
			data: {
				firstName: $firstName
				lastName: $lastName
				displayName: $displayName
				gender: $gender
				birthday: $birthday
				profileImageUrl: $profileImageUrl
				emailAddress: $emailAddress
				permissions: $permissions
				otpEnabled: false
				isActive: true
				password: $password
			}
		) {
			success
			message
		}
	}
`

export interface EditableUserProfileProps {
	showPermissionSelector?: boolean
	onSave?: () => void
	onCancel?: () => void
	isEditing?: boolean
	user: {
		userAccountId: string | null | undefined
		profileImageUrl: string | null | undefined
		firstName: string
		lastName: string
		displayName: string | null | undefined
		birthday: Date | null | undefined
		gender: string | null | undefined
		permissions: number
	}
	admin?: boolean
}

export interface EditableUserProfileState {
	modifiedState: any
	editing: boolean
	message: string
	valid: boolean
	allowPasswordChange: boolean
	fromAdmin: boolean
}

interface PermissionOptions {
	label: string
	value: number
}

export default class EditableUserProfile extends React.Component<EditableUserProfileProps, EditableUserProfileState> {
	constructor(props: EditableUserProfileProps) {
		super(props)

		this.state = {
			modifiedState: { permissions: props.user.permissions },
			editing: props.isEditing || false,
			message: '',
			valid: false,
			allowPasswordChange: false,
			fromAdmin: this.props.admin || false
		}
	}

	public handleChange = (e: React.ChangeEvent<HTMLInputElement>, validate: any) => {
		const permissionValue =
			e.target.name === 'permissions' ? ((e.target.value as unknown) as PermissionOptions).value : undefined
		const currentState = this.state.modifiedState
		currentState[e.target.name] = permissionValue ? permissionValue : e.target.value
		this.setState({ modifiedState: currentState })
		validate()
	}

	private onValidated = (isValid: boolean) => {
		this.setState({ valid: isValid })
	}

	public render() {
		const validDate = (d) => !d || moment(d).format('L') === d

		const finalUser = Object.assign(this.props.user, this.state.modifiedState)

		if (!this.state.modifiedState.birthday && this.props.user.birthday) {
			finalUser.birthday = moment(this.props.user.birthday).format('L')
		}
		const validations = [
			new FormValidationRule('firstName', 'isEmpty', false, 'Given name is required'),
			new FormValidationRule('lastName', 'isEmpty', false, 'Family name is required'),
			new FormValidationRule('birthday', validDate, true, 'Birthday must be in format MM/DD/YYYY')
		]

		if (!finalUser.userAccountId) {
			validations.push(new FormValidationRule('emailAddress', 'isEmpty', false, 'Email Address is required'))
		}

		const permissionOptions: PermissionOptions[] = [
			{
				label: 'User',
				value: Permissions.USER
			},
			{
				label: 'Administrator',
				value: Permissions.ADMIN
			}
		]
		const finalUserPermissions = this.state.editing ? finalUser.permissions : finalUser.permissions.value
		const selectedPermission = finalUserPermissions === Permissions.ADMIN ? permissionOptions[1] : permissionOptions[0]

		const genderOptions = ['Male', 'Female']
		if (finalUser.gender && genderOptions.includes(finalUser.gender) === false) {
			genderOptions.push(finalUser.gender)
		}

		return (
			<FormValidation validations={validations} data={finalUser} onValidated={this.onValidated}>
				{({ validate, validationErrors }) => {
					return (
						<div className="card">
							<div className="card-body">
								<h5 className="card-title">Profile</h5>
								{!this.props.user.userAccountId && (
									<ResponsiveValidatingInput
										label="E-mail Address"
										type="email"
										validationErrors={validationErrors}
										onChange={(e) => {
											this.handleChange(e, validate)
										}}
										readOnly={!this.state.editing}
										name="emailAddress"
										value={finalUser.emailAddress}
									/>
								)}
								<ResponsiveValidatingInput
									label="Photo"
									type="photo"
									onChange={(e) => {
										this.handleChange(e, validate)
									}}
									readOnly={!this.state.editing}
									name="profileImageUrl"
									value={finalUser.profileImageUrl || '/profile-default.jpg'}
									className="ml-auto mr-4"
									style={{
										width: '100px',
										height: '100px',
										padding: '4px',
										border: this.state.editing ? '1px dashed black' : '0px none'
									}}
								/>

								<ResponsiveValidatingInput
									validationErrors={validationErrors}
									onChange={(e) => {
										this.handleChange(e, validate)
									}}
									autoFocus
									label="Given Name"
									type="text"
									name="firstName"
									value={finalUser.firstName}
									readOnly={!this.state.editing}
								/>

								<ResponsiveValidatingInput
									validationErrors={validationErrors}
									onChange={(e) => {
										this.handleChange(e, validate)
									}}
									label="Family Name"
									type="text"
									name="lastName"
									value={finalUser.lastName}
									readOnly={!this.state.editing}
								/>

								<ResponsiveValidatingInput
									onChange={(e) => {
										this.handleChange(e, validate)
									}}
									label="Display Name"
									validationErrors={validationErrors}
									placeholder="Enter Display Name"
									type="text"
									name="displayName"
									value={finalUser.displayName}
									readOnly={!this.state.editing}
								/>

								<ResponsiveValidatingInput
									validationErrors={validationErrors}
									onChange={(e) => {
										this.handleChange(e, validate)
									}}
									label="Birthday"
									type="date"
									name="birthday"
									value={finalUser.birthday}
									readOnly={!this.state.editing}
								/>

								<ResponsiveValidatingInput
									onChange={(e) => {
										this.handleChange(e, validate)
									}}
									label="Gender"
									type="select"
									allowCustom
									helpText="You can enter a custom gender here"
									options={genderOptions}
									getOptionValue={(option) => option}
									getOptionLabel={(option) => option}
									name="gender"
									value={finalUser.gender}
									readOnly={!this.state.editing}
								/>

								{this.props.showPermissionSelector && (
									<ResponsiveValidatingInput
										onChange={(e) => {
											this.handleChange(e, validate)
										}}
										label="Role"
										type="select"
										options={permissionOptions}
										name="permissions"
										value={this.state.editing ? selectedPermission : selectedPermission.label}
										readOnly={!this.state.editing}
									/>
								)}
								{!this.state.allowPasswordChange && this.state.fromAdmin && (
									<button
										style={{ margin: '10px 0 0', paddingLeft: '0' }}
										className="btn btn-link"
										onClick={() => this.setState({ allowPasswordChange: true })}>
										Change Password?
									</button>
								)}

								{this.state.allowPasswordChange && (
									<ResponsiveValidatingInput
										validationErrors={validationErrors}
										onChange={(e) => {
											this.handleChange(e, validate)
										}}
										label="Password"
										type="password"
										name="password"
										value={finalUser.password}
										readOnly={!this.state.editing}
									/>
								)}

								{this.state.message && <div className="alert alert-warning">{this.state.message}</div>}
							</div>
							<div className="card-footer w-100">
								<div className="btn-toolbar">
									{this.state.editing ? (
										<div className="ml-auto">
											{finalUser.userAccountId && (
												<Mutation
													mutation={DELETE_USER_MUTATION}
													variables={{ userAccountId: finalUser.userAccountId }}>
													{(deleteAccount) => (
														<button
															className="btn btn-danger mr-2"
															onClick={async () => {
																const result = await deleteAccount()
																if (result.data.deleteAccount.success && this.props.onSave) {
																	this.props.onSave()
																} else {
																	alert(result.data.deleteAccount.message || 'Failed to delete user')
																}
															}}>
															Delete Account
														</button>
													)}
												</Mutation>
											)}
											<button
												className="btn btn-secondary mr-2"
												onClick={() => {
													this.setState({ editing: false, modifiedState: {} })
													if (this.props.onCancel) {
														this.props.onCancel()
													}
												}}>
												<i className="fa fa-fw fa-times" /> Cancel
											</button>
											<Mutation mutation={finalUser.userAccountId ? UPDATE_USER_MUTATION : CREATE_USER_MUTATION}>
												{(updateUser: (payload: any) => Promise<any>, { loading }) => {
													return (
														<button
															disabled={loading || !this.state.valid}
															onClick={async () => {
																const payload = this.state.modifiedState

																payload.userAccountId = this.props.user.userAccountId
																if (payload.birthday) {
																	payload.birthday = moment(payload.birthday, 'L').toDate()
																}

																const result = await updateUser({ variables: payload })
																const opResponse = result.data.update || result.data.createUser

																const newState = {
																	editing: !opResponse.success,
																	message: opResponse.message,
																	modifiedState: this.state.modifiedState
																}
																if (!newState.editing) {
																	newState.modifiedState = {}
																}
																this.setState(newState)
																if (!newState.editing && this.props.onSave) {
																	this.props.onSave()
																}
															}}
															className="btn btn-outline-success"
															type="button">
															{loading ? (
																<i className="fal fa-fw fa-spin fa-spinner" />
															) : (
																<i className="fal fa-fw fa-save" />
															)}{' '}
															Save Info
														</button>
													)
												}}
											</Mutation>
										</div>
									) : (
										<button
											className="btn btn-outline-info  ml-auto"
											onClick={() => {
												this.setState({ editing: true })
											}}>
											<i className="fa fa-fw fa-pencil" /> Edit Info
										</button>
									)}
								</div>
							</div>
						</div>
					)
				}}
			</FormValidation>
		)
	}
}
