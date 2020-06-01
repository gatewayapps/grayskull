import React, { useState } from 'react'
import MutationButton from '../MutationButton'
import gql from 'graphql-tag'

export interface OTPOption {
	type: 'email' | 'sms'
	id: string
	value: string
}

const SEND_OTP_MUTATION = gql`
	mutation SEND_OTP_MUTATION($emailAddress: String!, $type: String!, $id: String!) {
		sendOTP(emailAddress: $emailAddress, type: $type, id: $id) {
			success
			message
		}
	}
`

export const OTPBackupOptions: React.FC<{
	setOTPSent: (val) => void
	emailAddress: string
	options: OTPOption[]
	setStep: (string) => void
}> = ({ options, setStep, emailAddress, setOTPSent }) => {
	const [selectedOption, setSelectedOption] = useState<OTPOption | undefined>(undefined)
	const [busy, setBusy] = useState(false)
	return (
		<div>
			{options.map((opt) => (
				<button
					style={{ width: '100%', display: 'block', textAlign: 'left' }}
					onClick={() => setSelectedOption(opt)}
					key={opt.id}
					className={`btn btn-outline-info mb-2 ${selectedOption && selectedOption.id === opt.id ? 'active' : ''}`}>
					<div>
						{opt.type === 'email' ? (
							<>
								<i className="fal fa-fw fa-envelope" /> Email code to{' '}
							</>
						) : (
							<>
								<i className="fal fa-fw fa-mobile" /> Text code to{' '}
							</>
						)}
						{opt.value}
					</div>
				</button>
			))}
			<MutationButton
				mutation={SEND_OTP_MUTATION}
				variables={{ id: selectedOption?.id, type: selectedOption?.type, emailAddress }}
				content={
					<>
						<i className="fal fa-fw fa-sign-in" /> Send Code
					</>
				}
				busyContent={
					<>
						<i className="fal fa-fw fa-spin fa-spinner" /> Sending...
					</>
				}
				className="btn btn-success"
				disabled={!selectedOption || busy}
				onMutationStart={() => setBusy(true)}
				onMutationEnd={() => setBusy(false)}
				onSuccess={() => {
					setOTPSent(true)
					setStep('otp')
				}}
			/>
		</div>
	)
}
