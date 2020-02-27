import gql from 'graphql-tag'
import React, { useState } from 'react'
import MutationButton from './MutationButton'
import MultiFactorSetup from './MultiFactorSetup'
import ResponsiveInput from './ResponsiveInput'
import RequireConfiguration from './RequireConfiguration'
import { AddBackupPhoneNumber } from './AddBackupPhoneNumber'
import { BackupPhoneNumberSetup } from './BackupPhoneNumberSetup'

const SET_OTP_SECRET = gql`
	mutation SET_OTP_SECRET($otpSecret: String!, $password: String!) {
		setOtpSecret(data: { otpSecret: $otpSecret, password: $password }) {
			success
			message
			error
		}
	}
`

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

const SecurityMultifactorStatusComponent: React.FC<SecurityMutifactorStatusProps> = (props) => {
	const [changing, setChanging] = useState(false)
	const [promptForChange, setPromptForChange] = useState(false)
	const [promptForDisable, setPromptForDisable] = useState(false)
	const [password, setPassword] = useState('')

	const [message, setMessage] = useState('')
	const [otpSecret, setOtpSecret] = useState('')
	const [otpUpdated, setOtpUpdated] = useState(false)

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
			<div className="btn-toolbar ml-auto">
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

				<MutationButton
					mutation={SET_OTP_SECRET}
					variables={{ password: password, otpSecret: '' }}
					className="btn btn-danger"
					disabled={!password}
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
		footer = (
			<div className="btn-toolbar ml-auto">
				{props.user.otpEnabled && !props.configuration.Security.multifactorRequired && (
					<button
						className="btn btn-danger mr-2"
						onClick={() => {
							setPromptForDisable(false)
						}}>
						<i className="fa fa-fw fa-skull-crossbones" /> Disable
					</button>
				)}
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
			<div>
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
		)
	}

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
				{props.user.otpEnabled && props.configuration.Security.allowSMSBackupCodes && (
					<div className="mt-4">
						<h5>Backup Phone Number</h5>
						<BackupPhoneNumberSetup user={props.user} />
					</div>
				)}
			</div>
			<div className="card-footer d-flex">{footer}</div>
		</div>
	)
}
export default SecurityMultifactorStatusComponent
