import React from 'react'
import { IConfiguration } from '../../../foundation/types/types'
import { useState } from 'react'
import gql from 'graphql-tag'

import ResponsiveForm from '../ResponsiveForm'
import MutationButton from '../MutationButton'
import { LoginCredentials } from './Credentials'
import { withRouter } from 'next/router'
import { OTPOption, OTPBackupOptions } from './OTPBackupOptions'

export interface LoginProps {
	configuration: IConfiguration
	onAuthenticated: () => void
	router: any
}

const LOGIN_MUTATION = gql`
	mutation LOGIN_MUTATION($emailAddress: String!, $password: String!, $otpToken: String, $extendedSession: Boolean!) {
		login(
			data: { emailAddress: $emailAddress, password: $password, otpToken: $otpToken, extendedSession: $extendedSession }
		) {
			success
			message
			otpRequired
			emailVerificationRequired
			otpOptions {
				type
				id
				value
			}
		}
	}
`

const LoginForm: React.FC<LoginProps> = ({ configuration, onAuthenticated, router }) => {
	const [emailAddress, setEmailAddress] = useState('')
	const [password, setPassword] = useState('')
	const [otpToken, setOTPToken] = useState('')
	const [otpOptions, setOTPOptions] = useState<OTPOption[]>([])
	const [extendedSession, setExtendedSession] = useState(false)
	const [message, setMessage] = useState('')

	const [otpSent, setOTPSent] = useState(false)
	const [step, setStep] = useState<'credentials' | 'otp' | 'otpChoices' | 'emailVerification'>('credentials')
	const [busy, setBusy] = useState(false)

	const buttonRef = React.useRef<HTMLButtonElement>()
	React.useEffect(() => {
		if (otpToken.match(/\d,\d,\d,\d,\d,\d/)) {
			if (buttonRef && buttonRef.current) {
				buttonRef.current?.click()
			}
		}
	}, [otpToken])

	let body: React.ReactNode = (
		<LoginCredentials
			emailAddress={emailAddress}
			password={password}
			otpToken={otpToken}
			step={step}
			message={message}
			setStep={setStep}
			otpSent={otpSent}
			setEmailAddress={setEmailAddress}
			setPassword={setPassword}
			setOtpToken={setOTPToken}
			extendedSession={extendedSession}
			setExtendedSession={setExtendedSession}
			showSignup={configuration.Security!.allowSignup || false}
			routerQueryString={router.query}
		/>
	)
	if (step === 'otpChoices') {
		body = (
			<OTPBackupOptions
				message={message}
				setStep={setStep}
				setOTPSent={setOTPSent}
				emailAddress={emailAddress}
				options={otpOptions}
			/>
		)
	}

	const wrappedBody = (
		<div className="row">
			<div className="d-none d-md-block col-md-2 text-center">
				<img className="body-logo align-self-start w-100 my-2" src={configuration.Server.realmLogo || ''} />
			</div>
			<div className="col-12 col-md-10 ">{body}</div>
		</div>
	)

	return (
		<form
			autoComplete="off"
			onSubmit={(e) => {
				e.preventDefault()
			}}>
			<ResponsiveForm
				formHeader={
					<span>
						<img className="d-inline d-md-none header-logo mr-2" src={configuration.Server.realmLogo || ''} />
						Login to {configuration.Server.realmName}
					</span>
				}
				formBody={wrappedBody}
				formFooter={
					<div className="btn-toolbar float-right">
						<MutationButton
							buttonRef={buttonRef}
							disabled={busy}
							content={
								<>
									<i className="fal fa-sign-in" /> Login
								</>
							}
							busyContent={
								<>
									<i className="fal fa-fw fa-spin fa-spinner" /> Logging In...
								</>
							}
							mutation={LOGIN_MUTATION}
							variables={{ emailAddress, password, otpToken: otpToken.split(',').join(''), extendedSession }}
							onMutationStart={() => {
								setBusy(true)
							}}
							onMutationEnd={() => {
								setBusy(false)
							}}
							onSuccess={({ data }) => {
								if (data.login.success) {
									onAuthenticated()
								} else if (data.login.otpRequired) {
									setOTPOptions(data.login.otpOptions)
									setMessage(data.login.message)
									setOTPToken('')
									setStep('otp')
								} else if (data.login.emailVerificationRequired) {
									setMessage('You must verify your e-mail address before signing in.')
								} else {
									setMessage(data.login.message)
								}
							}}
							className="btn btn-outline-success"
						/>
					</div>
				}
			/>
		</form>
	)
}

export default withRouter(LoginForm)
