/* eslint-disable indent */
import React, { useState } from 'react'
import ResponsiveInput from '../ResponsiveInput'
import Link from 'next/link'

export interface LoginCredentialsProps {
	emailAddress: string
	password: string
	otpToken: string
	extendedSession: boolean
	step: 'credentials' | 'otp' | 'otpChoices' | 'emailVerification'
	setEmailAddress: (value: string) => void
	setPassword: (value: string) => void
	setOtpToken: (value: string) => void
	setExtendedSession: (value: boolean) => void
	showSignup: boolean
	routerQueryString?: string
}

export const LoginCredentials: React.FC<LoginCredentialsProps> = ({
	emailAddress,
	setEmailAddress,
	password,
	setPassword,
	otpToken,
	setOtpToken,
	step,
	extendedSession,
	setExtendedSession,
	showSignup,
	routerQueryString
}) => {
	const [otpAutofill, setOtpAutofill] = useState('')
	const forgotPasswordLink = `/resetPassword${emailAddress ? '?emailAddress=' + emailAddress : ''}`
	return (
		<div>
			<ResponsiveInput
				autoComplete="nope"
				name="emailAddress"
				type={step === 'credentials' ? 'email' : 'hidden'}
				label="E-mail Address"
				value={emailAddress}
				onChange={(e) => {
					setEmailAddress(e.target.value)
				}}
				autoFocus
			/>
			<ResponsiveInput
				type={step === 'credentials' ? 'password' : 'hidden'}
				name="password"
				value={password}
				onChange={(e) => {
					setPassword(e.target.value)
				}}
				label="Password"
			/>
			<ResponsiveInput
				type={step === 'otp' ? 'otp' : 'hidden'}
				name="otpToken"
				value={otpToken || otpAutofill}
				onChange={
					step === 'otp'
						? (e) => {
								setOtpAutofill('')
								setOtpToken(e.target.value)
						  }
						: (e) => {
								const parts: string[] = []
								for (let i = 0; i < 6; i++) {
									if (e.target.value.length > i) {
										parts[i] = e.target.value[i]
									} else {
										parts[i] = ''
									}
								}

								setOtpAutofill(parts.join(','))
						  }
				}
				label="OTP Token"
			/>
			{step === 'credentials' && (
				<div className="form-check mb-3">
					<input
						id="extendedSessionCheck"
						className="form-check-input"
						type="checkbox"
						checked={extendedSession}
						onChange={() => {
							setExtendedSession(!extendedSession)
						}}
					/>
					<label className="form-check-label" htmlFor="extendedSessionCheck">
						Keep me signed in
					</label>
				</div>
			)}
			{showSignup && (
				<div>
					Need an account?
					<Link href={{ pathname: '/register', query: routerQueryString }}>
						<a className="ml-2">Create one!</a>
					</Link>
				</div>
			)}
			<div className="mt-3">
				<Link href={forgotPasswordLink}>
					<a>Forgot Password</a>
				</Link>
			</div>
		</div>
	)
}
