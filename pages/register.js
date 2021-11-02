import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { withRouter } from 'next/router'

import { Mutation } from 'react-apollo'
import Primary from '../presentation/layouts/primary'

import MultiFactorSetup from '../presentation/components/MultiFactorSetup'
import RequireConfiguration from '../presentation/components/RequireConfiguration'
import RegistrationForm from '../presentation/components/RegistrationForm'

import BackgroundCover from '../presentation/components/BackgroundCover'
import ResponsiveForm from '../presentation/components/ResponsiveForm'

const RegistrationSteps = {
	UserData: 1,
	Multifactor: 2
}

const REGISTER_USER_MUTATION = gql`
	mutation REGISTER_USER_MUTATION(
		$emailAddress: String!
		$firstName: String!
		$lastName: String!
		$password: String!
		$confirm: String!
		$otpSecret: String
	) {
		registerUser(
			data: {
				emailAddress: $emailAddress
				firstName: $firstName
				lastName: $lastName
				password: $password
				confirm: $confirm
				otpSecret: $otpSecret
			}
		) {
			success
			autoVerified
			message
			error
		}
	}
`

class RegisterPage extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			configuration: {},
			data: {
				emailAddress: '',
				firstName: '',
				lastName: '',
				password: '',
				confirm: '',
				otpSecret: undefined
			},
			autoVerified: false,
			creatingAccount: false,
			accountCreated: false,
			message: '',
			userDataValid: false,
			showMfaForm: false,
			requireMfaVerification: false,
			step: RegistrationSteps.UserData,
			redirectSeconds: 15
		}
	}

	isValid = (configuration) => {
		switch (this.state.step) {
			case RegistrationSteps.UserData:
				return this.state.userDataValid

			case RegistrationSteps.Multifactor:
				if ((this.state.requireMfaVerification || configuration.multifactorRequired) && !this.state.data.otpSecret) {
					return false
				}
				break
		}

		return true
	}

	onFormValueChanged = (name, value) => {
		this.setState((prevState) => {
			return {
				...prevState,
				data: {
					...prevState.data,
					[name]: value
				}
			}
		})
	}

	onFormValidated = (isValid) => {
		this.setState({ userDataValid: isValid })
	}

	onMfaVerified = (otpSecret) => {
		this.setState((prevState) => {
			return {
				...prevState,
				data: {
					...prevState.data,
					otpSecret
				}
			}
		})
	}

	onSubmitClick = async (registerUser) => {
		switch (this.state.step) {
			case RegistrationSteps.UserData:
				this.setState({ step: RegistrationSteps.Multifactor })
				break

			case RegistrationSteps.Multifactor:
				this.setState({ creatingAccount: true })
				const { data } = await registerUser()
				if (data && data.registerUser) {
					if (data.registerUser.success) {
						this.setState({
							autoVerified: data.registerUser.autoVerified,
							creatingAccount: false,
							accountCreated: true,
							message: data.registerUser.message
						})
						this.handleLoginRedirect()
					} else {
						this.setState({ error: data.registerUser.error, creatingAccount: false })
					}
				} else {
					this.setState({ creatingAccount: false })
				}
				break
		}
	}

	setRequireMfaVerification = (enabled) => {
		this.setState({ requireMfaVerification: enabled, showMfaForm: enabled })
	}

	handleLoginRedirect = () => {
		let redirectSeconds = 15
		const interval = setInterval(() => {
			if (redirectSeconds === 0) {
				clearInterval(interval)
				window.location.href = '/login'
			} else {
				redirectSeconds--
				this.setState({ redirectSeconds })
			}
		}, 1000)
	}

	renderSuccessMessage = () => {
		if (this.state.autoVerified) {
			return (
				<div className="alert alert-success">
					{this.state.message} Redirecting to <a href="/login">Login page</a> in {this.state.redirectSeconds} seconds...
				</div>
			)
		} else {
			return <div className="alert alert-success">{this.state.message}</div>
		}
	}

	render() {
		return (
			<Primary>
				<RequireConfiguration>
					{(configuration) => {
						const { Security: securityConfiguration, Server: serverConfiguration } = configuration
						return (
							<Mutation mutation={REGISTER_USER_MUTATION} variables={this.state.data}>
								{(registerUser, { loading, error }) => (
									<form
										onSubmit={(e) => {
											e.preventDefault()
										}}>
										<BackgroundCover>
											<div className="container">
												<ResponsiveForm
													formHeader={<span>Register for {serverConfiguration.realmName}</span>}
													formBody={
														<div>
															{error && <div className="alert alert-danger">{error.message}</div>}
															{this.state.error && <div className="alert alert-danger">{this.state.error}</div>}
															{this.state.message && this.renderSuccessMessage()}
															{!this.state.accountCreated && (
																<div>
																	{this.state.step === RegistrationSteps.UserData && (
																		<RegistrationForm
																			configuration={securityConfiguration}
																			data={this.state.data}
																			onChange={this.onFormValueChanged}
																			onValidated={this.onFormValidated}
																		/>
																	)}
																	{this.state.step === RegistrationSteps.Multifactor && (
																		<div>
																			{securityConfiguration.multifactorRequired && (
																				<p>Multi-factor authentication is required to complete account registration.</p>
																			)}
																			{!this.state.showMfaForm && !securityConfiguration.multifactorRequired && (
																				<div>
																					<p>
																						Make your account more secure and require a one-time authentication code to
																						login.
																					</p>
																					<button
																						className="btn btn-primary"
																						onClick={() => this.setRequireMfaVerification(true)}>
																						Enable Multi-Factor Authentication
																					</button>
																				</div>
																			)}
																			{(this.state.showMfaForm || securityConfiguration.multifactorRequired) && (
																				<MultiFactorSetup
																					emailAddress={this.state.data.emailAddress}
																					required={securityConfiguration.multifactorRequired}
																					onCancel={() => this.setRequireMfaVerification(false)}
																					onVerified={this.onMfaVerified}
																				/>
																			)}
																		</div>
																	)}
																</div>
															)}
														</div>
													}
													formFooter={
														<div className="btn-toolbar float-right">
															<button
																type="submit"
																className="btn btn-primary"
																disabled={
																	!this.isValid(securityConfiguration) ||
																	this.state.creatingAccount ||
																	this.state.accountCreated
																}
																onClick={() => this.onSubmitClick(registerUser)}>
																{loading && <i className="fa fa-fw fa-spin fa-spinner mr-2" />}
																{this.state.step === RegistrationSteps.Multifactor ? 'Register' : 'Next'}
															</button>
														</div>
													}
												/>
											</div>
										</BackgroundCover>
									</form>
								)}
							</Mutation>
						)
					}}
				</RequireConfiguration>
			</Primary>
		)
	}
}

export default withRouter(RegisterPage)
