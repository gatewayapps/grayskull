import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import React, { useState } from 'react'
import gql from 'graphql-tag'
import MutationButton from './MutationButton'

const SEND_VERIFICATION_CODE_TO_PHONE_NUMBER = gql`
	mutation SEND_VERIFICATION_CODE_TO_PHONE_NUMBER($phoneNumber: String!) {
		sendVerificationCodeToPhoneNumber(phoneNumber: $phoneNumber) {
			success
			message
		}
	}
`

const ADD_PHONE_NUMBER_WITH_VERIFICATION_CODE = gql`
	mutation ADD_PHONE_NUMBER_WITH_VERIFICATION_CODE($phoneNumber: String!, $verificationCode: String!) {
		addPhoneNumberWithVerificationCode(phoneNumber: $phoneNumber, verificationCode: $verificationCode) {
			success
			message
		}
	}
`

export interface BackupPhoneNumberSetupProps {
	user: any
}

export const BackupPhoneNumberSetup: React.FC<BackupPhoneNumberSetupProps> = ({ user }) => {
	const [adding, setAdding] = useState(false)
	const [verifying, setVerifying] = useState(false)
	const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '')
	const [verificationCode, setVerificationCode] = useState('')
	if (user.phoneNumber) {
		return (
			<ResponsiveValidatingInput
				name="txtPhoneNumber"
				type="text"
				readOnly
				value={user.phoneNumber}
				label="Mobile Phone Number"
			/>
		)
	}
	if (adding) {
		return (
			<div className="container">
				<div className="row">
					<div className="col-12 col-md-8">
						<ResponsiveValidatingInput
							name="txtPhoneNumber"
							onChange={(e) => {
								setPhoneNumber(e.target.value)
								setVerifying(false)
							}}
							type="phone"
							value={phoneNumber}
							label="Mobile Phone Number"
						/>
					</div>
					<div className="col-12 col-md-4">
						<MutationButton
							mutation={SEND_VERIFICATION_CODE_TO_PHONE_NUMBER}
							variables={{ phoneNumber }}
							disabled={verifying}
							busyContent={
								<>
									<i className="fa fa-fw fa-spin fa-spinner" /> Sending Code...
								</>
							}
							onSuccess={() => {
								setVerifying(true)
							}}
							content="Send Verification Code"
							className="btn btn-outline-success"
						/>
					</div>
				</div>
				{verifying && (
					<div className="row">
						<div className="col-12 col-md-8">
							<ResponsiveValidatingInput
								name="txtVerificationCode"
								onChange={(e) => {
									setVerificationCode(e.target.value)
								}}
								max="999999"
								type="number"
								value={verificationCode}
								label="Verification Code"
							/>
						</div>
						<div className="col-12 col-md-4">
							<MutationButton
								mutation={ADD_PHONE_NUMBER_WITH_VERIFICATION_CODE}
								variables={{ phoneNumber, verificationCode }}
								busyContent={
									<>
										<i className="fa fa-fw fa-spin fa-spinner" /> Saving Phone Number...
									</>
								}
								content="Verify and Save"
								className="btn btn-outline-success"
							/>
						</div>
					</div>
				)}
			</div>
		)
	} else {
		return (
			<button
				className="btn btn-outline-success"
				onClick={() => {
					setAdding(true)
				}}>
				<i className="fa fa-fw fa-plus" /> Add Backup Phone Number
			</button>
		)
	}
}
