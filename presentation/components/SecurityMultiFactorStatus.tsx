import gql from 'graphql-tag'
import React, { useEffect, useState } from 'react'
import MutationButton from './MutationButton'
import MultiFactorSetup from './MultiFactorSetup'
import ResponsiveInput from './ResponsiveInput'

import { BackupPhoneNumberSetup } from './BackupPhoneNumberSetup'

import { CardFooter } from './CardFooter'
import { FormRow } from './FormRow'
import { useMutation, useLazyQuery } from 'react-apollo'
import AdaptiveInput, { AdaptiveInputOnChangeFunc } from './AdaptiveInput'

const GET_OTP_SECRET = gql`
	query GET_OTP_SECRET($emailAddress: String!) {
		getOtpSecret(data: { emailAddress: $emailAddress })
	}
`

const VERIFY_MFA_KEY = gql`
	mutation VERIFY_MFA_KEY($secret: String!, $token: String!) {
		verifyMfaKey(data: { secret: $secret, token: $token })
	}
`

const SET_OTP_SECRET = gql`
	mutation SET_OTP_SECRET($otpSecret: String!, $password: String!) {
		setOtpSecret(data: { otpSecret: $otpSecret, password: $password }) {
			success
			message
			error
		}
	}
`

interface GetOtpSecretData {
	getOtpSecret: string | null
}

interface GetOtpSecretVariables {
	emailAddress: string
}

export interface SecurityMutifactorStatusProps {
	user: any
	refresh: any
	configuration: any
}

export interface SecurityMutifactorStatusState {
	changing: boolean
	promptForChange: boolean
	promptForDisable: boolean
	isValid: boolean
	password: string
	message: string
	otpSecret: string
	otpUpdated: boolean
}

interface VerifyMfaKeyData {
	verifyMfaKey: boolean | null
}

interface VerifyMfaKeyVariables {
	secret: string
	token: string
}

const SecurityMultifactorStatusComponent: React.FC<SecurityMutifactorStatusProps> = (props) => {
	const [changing, setChanging] = useState(false)
	const [promptForChange, setPromptForChange] = useState(false)
	const [promptForDisable, setPromptForDisable] = useState(false)
	const [password, setPassword] = useState('')
	const [existingOtpSecret, setExistingOtpSecret] = useState('')
	const [isVerified, setIsVerified] = useState(false)
	const [mfaToVerify, setMfaToVerify] = useState('')

	const [message, setMessage] = useState('')
	const [otpSecret, setOtpSecret] = useState('')
	const [otpUpdated, setOtpUpdated] = useState(false)
	const [getOtpSecret, { data }] = useLazyQuery<GetOtpSecretData, GetOtpSecretVariables>(GET_OTP_SECRET)
	const [verifyMfaKey] = useMutation<VerifyMfaKeyData, VerifyMfaKeyVariables>(VERIFY_MFA_KEY)

	useEffect(() => {
		if (data && data.getOtpSecret) {
			setExistingOtpSecret(data.getOtpSecret)
			setIsVerified(false)
		}
	}, [data])

	const verifyToken = React.useCallback(async () => {
		const { data } = await verifyMfaKey({
			variables: { secret: existingOtpSecret, token: mfaToVerify.split(',').join('') }
		})
		if (data?.verifyMfaKey === true) {
			setIsVerified(true)
		}
	}, [verifyMfaKey, existingOtpSecret, mfaToVerify])

	const handleTokenChanged: AdaptiveInputOnChangeFunc = React.useCallback((evt) => {
		setMfaToVerify(evt.target.value)
	}, [])

	useEffect(() => {
		const mfaToken = mfaToVerify.split(',').join('')
		if (!existingOtpSecret || mfaToken.length < 6) return
		verifyToken()
	}, [existingOtpSecret, mfaToVerify, verifyToken])

	let body = <div />
	let footer = <div />

	if (changing) {
		body = (
			<div>
				<MultiFactorSetup
					emailAddress={props.user.emailAddress}
					required={true}
					onVerified={(otpSecret) => {
						setOtpSecret(otpSecret)
					}}
				/>
				<div className="mx-4 px-4">
					<ResponsiveInput
						label="Enter your password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value)
						}}
						type="password"
					/>

					{message && <div className="alert alert-danger">{message}</div>}
				</div>
			</div>
		)
		footer = (
			<div className="ml-auto">
				<button
					className="btn btn-secondary mr-2"
					onClick={() => {
						setChanging(false)
						setMessage('')
						setPassword('')
						setOtpUpdated(false)
					}}>
					<i className="fa fa-fw fa-times" /> Cancel
				</button>

				<MutationButton
					mutation={SET_OTP_SECRET}
					variables={{ password: password, otpSecret: otpSecret }}
					className="btn btn-success"
					disabled={!otpSecret}
					onFail={(err) => {
						alert(err)
					}}
					onSuccess={(result) => {
						if (result.data.setOtpSecret.success) {
							setChanging(false)
							setOtpUpdated(true)
							setPassword('')
							setOtpSecret('')

							props.refresh()
						} else {
							setMessage(result.data.setOtpSecret.message)
						}
					}}
					busyContent={
						<span>
							<i className="fa fa-fw fa-spin fa-spinner" /> Updating
						</span>
					}
					content={
						<span>
							<i className="fa fa-fw fa-save" /> Update Configuration
						</span>
					}
				/>
			</div>
		)
	} else if (promptForChange) {
		body = (
			<div className="alert alert-danger">
				You already have an authenticator app configured. If you proceed, your existing authenticator app will no longer
				work.
			</div>
		)
		footer = (
			<div className="btn-toolbar ml-auto">
				<button
					className="btn btn-secondary mr-2"
					onClick={() => {
						setChanging(false)
						setPromptForChange(false)
						setMessage('')
						setPassword('')
						setOtpUpdated(false)
					}}>
					<i className="fa fa-fw fa-times" /> Never Mind!
				</button>

				<button
					className="btn btn-success"
					onClick={() => {
						setChanging(true)
						setPromptForChange(false)
					}}>
					<i className="fa fa-fw fa-check" /> I Understand, Proceed
				</button>
			</div>
		)
	} else if (promptForDisable) {
		body = (
			<>
				<div className="alert alert-danger">
					You are about to disable your authenticator app. If you proceed, your existing authenticator app will no
					longer work.
				</div>
				<p>Enter your authentication code below to continue.</p>
				<AdaptiveInput
					type="otp"
					className="form-control"
					name="mfaToken"
					placeholder="Enter code here"
					value={mfaToVerify}
					onChange={handleTokenChanged}
				/>
				<div className="mx-4 px-4 mt-4">
					<ResponsiveInput
						label="Enter your password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value)
						}}
						type="password"
					/>

					{message && <div className="alert alert-danger">{message}</div>}
				</div>
			</>
		)
		footer = (
			<div className="btn-toolbar ml-auto">
				<button
					className="btn btn-secondary mr-2"
					onClick={() => {
						setMessage('')
						setPassword('')
						setExistingOtpSecret('')
						setIsVerified(false)
						setMfaToVerify('')
						setPromptForDisable(false)
					}}>
					<i className="fa fa-fw fa-times" /> Never Mind!
				</button>

				<MutationButton
					mutation={SET_OTP_SECRET}
					variables={{ password: password, otpSecret: '' }}
					className="btn btn-danger"
					disabled={!isVerified || !password}
					onFail={(err) => {
						alert(err)
					}}
					onSuccess={(result) => {
						if (result.data.setOtpSecret.success) {
							setPromptForDisable(false)
							setChanging(false)
							setOtpUpdated(false)
							setPassword('')
							setOtpSecret('')

							props.refresh()
						} else {
							setMessage(result.data.setOtpSecret.message)
						}
					}}
					busyContent={
						<span>
							<i className="fa fa-fw fa-spin fa-spinner" /> Disabling
						</span>
					}
					content={
						<span>
							<i className="fa fa-fw fa-save" /> I Understand, Disable App
						</span>
					}
				/>
			</div>
		)
	} else {
		const showDisable = props.user.otpEnabled && !props.configuration.Security.multifactorRequired
		footer = (
			<div className="ml-auto">
				{showDisable ? (
					<button
						className="btn btn-danger mr-2"
						onClick={async () => {
							await getOtpSecret({
								variables: { emailAddress: props.user.emailAddress }
							})
							setPromptForDisable(true)
						}}>
						<i className="fa fa-fw fa-skull-crossbones" /> Disable
					</button>
				) : null}
				<button
					className="btn btn-secondary"
					onClick={() => {
						if (props.user.otpEnabled) {
							setPromptForChange(true)
						} else {
							setChanging(true)
						}
					}}>
					<i className="fa fa-fw fa-wrench" /> Configure App
				</button>
			</div>
		)
		body = (
			<FormRow>
				<div className="col-12">
					<ResponsiveInput
						label="Status"
						value={props.user.otpEnabled ? 'Configured' : 'Not Configured'}
						type="static"
						className="form-control form-control-static"
						readOnly
					/>
					{otpUpdated && (
						<div className="alert alert-success mx-4">Your account is now protected by an Authenticator App.</div>
					)}
				</div>
			</FormRow>
		)
	}

	const shouldRenderPhoneSection = props.user.otpEnabled && props.configuration.Security.allowSMSBackupCodes

	return (
		<div className="card">
			<div className="card-body">
				<h5 className="card-title">
					Authenticator App
					{props.user.otpEnabled ? (
						<i className="ml-2 text-success fa fa-fw fa-shield-check" />
					) : (
						<i className="ml-2 text-danger fa fa-fw fa-exclamation-triangle" />
					)}
				</h5>
				{body}
				{shouldRenderPhoneSection ? (
					<div className="mt-4">
						<h5>Backup Phone Number</h5>
						<BackupPhoneNumberSetup refreshContext={props.refresh} user={props.user} />
					</div>
				) : null}
			</div>
			<CardFooter>{footer}</CardFooter>
		</div>
	)
}
export default SecurityMultifactorStatusComponent
