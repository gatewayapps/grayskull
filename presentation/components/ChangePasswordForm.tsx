import React from 'react'

import { validatePassword } from '../utils/passwordComplexity'
import PasswordComplexity from './PasswordComplexity'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import FormValidation, { FormValidationRule } from './FormValidation'
import RequireConfiguration from './RequireConfiguration'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import ResponsiveForm from './ResponsiveForm'
import Router from 'next/router'
import Link from 'next/link'

const CHANGE_PASSWORD_REDIRECT_COUNTDOWN = 5

const CHANGE_PASSWORD = gql`
	mutation CHANGE_PASSWORD($emailAddress: String!, $newPassword: String!, $confirmPassword: String!, $token: String) {
		changePassword(
			data: { emailAddress: $emailAddress, newPassword: $newPassword, confirmPassword: $confirmPassword, token: $token }
		) {
			success
			message
		}
	}
`

export default class ChangePasswordForm extends React.Component<{
	emailAddress: string
	token: string
	oldPassword?: string
	newPassword?: string
	confirmPassword?: string
}> {
	state = {
		isValid: false,
		newPassword: '',
		oldPassword: '',
		confirmPassword: '',
		passwordChanged: false,
		message: '',
		redirectCountdown: CHANGE_PASSWORD_REDIRECT_COUNTDOWN
	}

	redirectInterval: any

	componentWillUnmount() {
		if (this.redirectInterval) {
			window.clearTimeout(this.redirectInterval)
		}
	}

	onChangePassword = async (changePassword) => {
		const result = await changePassword()
		const { data } = result
		if (data.changePassword.success) {
			this.setState({ passwordChanged: true })
			this.redirectInterval = window.setInterval(() => {
				const redirectCountdown = this.state.redirectCountdown - 1
				if (redirectCountdown <= 0) {
					window.clearTimeout(this.redirectInterval)
					this.redirectInterval = undefined
					Router.push('/login')
				} else {
					this.setState({ redirectCountdown })
				}
			}, 1000)
		} else {
			this.setState({ message: data.changePassword.message })
		}
	}

	onValidated = (isValid) => {
		this.setState({ isValid })
	}

	render = () => {
		const mutationVariables = {
			emailAddress: this.props.emailAddress,
			token: this.props.token,
			oldPassword: this.props.oldPassword,
			newPassword: this.state.newPassword,
			confirmPassword: this.state.confirmPassword
		}

		const handleChange = (e, validate) => {
			this.setState({ [e.target.name]: e.target.value })
			if (validate) {
				validate()
			}
		}

		return (
			<RequireConfiguration>
				{(configuration) => {
					const { Security: securityConfiguration } = configuration
					if (!securityConfiguration || securityConfiguration === {}) {
						return <div>Loading...</div>
					}
					const validations = [
						new FormValidationRule('newPassword', 'isEmpty', false, 'New password is required'),
						new FormValidationRule(
							'newPassword',
							validatePassword,
							true,
							'New password does not meet complexity requirements',
							[securityConfiguration]
						),
						new FormValidationRule('confirmPassword', 'isEmpty', false, 'Confirm password is required'),
						new FormValidationRule('confirmPassword', 'equals', true, 'Confirm should match the password', [
							this.state.newPassword
						])
					]
					return (
						<FormValidation validations={validations} data={this.state} onValidated={this.onValidated}>
							{({ validate, validationErrors }) => (
								<ResponsiveForm
									formHeader={<span>Change your password</span>}
									formBody={
										<div>
											{!this.props.token && (
												<div>
													<p className="card-text">Enter your current password here</p>
													<ResponsiveValidatingInput
														validationErrors={validationErrors}
														label="Current Password"
														autoComplete="current-password"
														type="password"
														name="oldPassword"
														value={this.state.oldPassword}
														onChange={(e) => handleChange(e, validate)}
													/>
												</div>
											)}

											<p className="card-text">Please enter your new password below, then re-type it to confirm.</p>

											<ResponsiveValidatingInput
												validationErrors={validationErrors}
												label="New Password"
												autoComplete="new-password"
												type="password"
												name="newPassword"
												value={this.state.newPassword}
												onChange={(e) => handleChange(e, validate)}
											/>

											<div
												className="alert alert-secondary border-secondary col-12 col-md-9 offset-md-3"
												style={{ border: '1px solid' }}>
												<div className="alert-heading">Password requirements</div>
												<div>
													<PasswordComplexity configuration={securityConfiguration} password={this.state.newPassword} />
												</div>
											</div>

											<ResponsiveValidatingInput
												type="password"
												label="Confirm Password"
												validationErrors={validationErrors}
												autoComplete="new-password"
												name="confirmPassword"
												value={this.state.confirmPassword}
												onChange={(e) => handleChange(e, validate)}
											/>
											{this.state.passwordChanged && (
												<div className="alert alert-success mx-4">
													Your password has been changed. You will be redirected to the login page in{' '}
													{this.state.redirectCountdown}
													{this.state.redirectCountdown === 1 ? ' second' : ' seconds'} or{' '}
													<Link href="/login">
														<a>click here</a>
													</Link>{' '}
													to go to login now.
												</div>
											)}
											{this.state.message && <div className="alert alert-info mx-4">{this.state.message}</div>}
										</div>
									}
									formFooter={
										<div className="btn-toolbar float-right">
											<Mutation mutation={CHANGE_PASSWORD} variables={mutationVariables}>
												{(changePassword, { loading }) => {
													return (
														<div>
															<button
																disabled={loading || this.state.passwordChanged || !this.state.isValid}
																onClick={() => {
																	this.onChangePassword(changePassword)
																}}
																className="btn btn-outline-success"
																type="submit">
																{loading ? (
																	<i className="fal fa-fw fa-spin fa-spinner" />
																) : (
																	<i className="fal fa-fw fa-check" />
																)}{' '}
																Set Password
															</button>
														</div>
													)
												}}
											</Mutation>
										</div>
									}
								/>
							)}
						</FormValidation>
					)
				}}
			</RequireConfiguration>
		)
	}
}
