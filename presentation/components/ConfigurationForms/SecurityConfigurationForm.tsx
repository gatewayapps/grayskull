import React from 'react'
import FormValidation, { FormValidationRule } from '../FormValidation'
import ResponsiveValidatingInput from '../ResponsiveValidatingInput'
import { ISecurityConfiguration } from '../../../foundation/models/ISecurityConfiguration'

export interface ISecurityConfigurationFormProps {
	data: ISecurityConfiguration
	onValidated: (isValid: boolean, errors: any) => void
	onConfigurationChanged: (configuration: ISecurityConfiguration) => void
}

const SecurityConfigurationForm = ({ data, onValidated, onConfigurationChanged }: ISecurityConfigurationFormProps) => {
	const handleChange = (e, validate) => {
		switch (e.target.type) {
			case 'checkbox': {
				data[e.target.name] = e.target.checked
				break
			}
			case 'number': {
				data[e.target.name] = parseInt(e.target.value)
				break
			}
			default: {
				data[e.target.name] = e.target.value
			}
		}

		onConfigurationChanged(data)
		if (validate) {
			validate()
		}
	}

	const validations = [
		new FormValidationRule(
			'passwordMinimumLength',
			'isInt',
			true,
			'Min Password Length is required and must be between 6 and 64',
			[{ gt: 5, lt: 65 }]
		),
		new FormValidationRule(
			'twilioApiKey',
			(val, currentData) => {
				return !currentData.allowSMSBackupCodes || currentData.twilioApiKey.length > 0
			},
			true,
			'If SMS Backups codes are allowed, you must provide a Twilio Auth Token',
			[data]
		),
		new FormValidationRule(
			'twilioSID',
			(val, currentData) => {
				return !currentData.allowSMSBackupCodes || currentData.twilioSID.length > 0
			},
			true,
			'If SMS Backups codes are allowed, you must provide a Twilio SID',
			[data]
		),
		new FormValidationRule(
			'smsFromNumber',
			(val, currentData) => {
				return !currentData.allowSMSBackupCodes || currentData.smsFromNumber.length > 5
			},
			true,
			'If SMS Backups codes are allowed, you must provide a valid phone number',
			[data]
		)
	]

	return (
		<div>
			<FormValidation validations={validations} data={data} onValidated={onValidated}>
				{({ validate, validationErrors }) => (
					<div>
						<h5>Security Configuration</h5>
						<h6 style={{ marginTop: '1rem', marginBottom: '-0.25rem' }}>Password Rules</h6>

						<ResponsiveValidatingInput
							labelColumnWidth={4}
							labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
							validationErrors={validationErrors}
							label="Require lowercase"
							name="passwordRequiresLowercase"
							type="checkbox"
							checked={data.passwordRequiresLowercase || false}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
							validationErrors={validationErrors}
							label="Require uppercase"
							name="passwordRequiresUppercase"
							type="checkbox"
							checked={data.passwordRequiresUppercase || false}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
							validationErrors={validationErrors}
							label="Require number"
							name="passwordRequiresNumber"
							type="checkbox"
							checked={data.passwordRequiresNumber || false}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							labelStyles={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
							validationErrors={validationErrors}
							label="Require symbol"
							name="passwordRequiresSymbol"
							type="checkbox"
							checked={data.passwordRequiresSymbol || false}
							onChange={(e) => handleChange(e, validate)}
						/>

						<ResponsiveValidatingInput
							validationErrors={validationErrors}
							label="Minimum Length"
							labelColumnWidth={4}
							autoComplete="off"
							min="6"
							max="64"
							type="number"
							name="passwordMinimumLength"
							value={data.passwordMinimumLength}
							onChange={(e) => handleChange(e, validate)}
						/>

						<h6 style={{ marginTop: '1rem', marginBottom: '-0.25rem' }}>Multifactor Rules</h6>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							validationErrors={validationErrors}
							label="Require Multifactor Authentication"
							name="multifactorRequired"
							type="checkbox"
							checked={data.multifactorRequired || false}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							validationErrors={validationErrors}
							label="Allow SMS Backup Codes"
							name="allowSMSBackupCodes"
							type="checkbox"
							checked={data.allowSMSBackupCodes || false}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							validationErrors={validationErrors}
							label="Twilio SID"
							disabled={!data.allowSMSBackupCodes}
							name="twilioSID"
							type="password"
							value={data.twilioSID}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							validationErrors={validationErrors}
							label="Twilio Auth Token"
							disabled={!data.allowSMSBackupCodes}
							name="twilioApiKey"
							type="password"
							value={data.twilioApiKey}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							labelColumnWidth={4}
							validationErrors={validationErrors}
							label="Send From Phone Number"
							disabled={!data.allowSMSBackupCodes}
							name="smsFromNumber"
							type="phone"
							options={{ phone: true, phoneCountry: 'US' }}
							value={data.smsFromNumber}
							onChange={(e) => handleChange(e, validate)}
						/>

						<h6 style={{ marginTop: '1rem', marginBottom: '-0.25rem' }}>Miscellaneous</h6>

						<ResponsiveValidatingInput
							labelColumnWidth={4}
							validationErrors={validationErrors}
							label="Allow Registration"
							name="allowSignup"
							type="checkbox"
							checked={data.allowSignup || false}
							onChange={(e) => handleChange(e, validate)}
						/>

						<ResponsiveValidatingInput
							labelColumnWidth={4}
							disabled={!data.allowSignup}
							validationErrors={validationErrors}
							label="Allowed Domains for Sign Up"
							name="domainWhitelist"
							type="text"
							value={data.domainWhitelist}
							onChange={(e) => handleChange(e, validate)}
						/>

						<ResponsiveValidatingInput
							validationErrors={validationErrors}
							label="Token Duration (sec)"
							labelColumnWidth={4}
							autoComplete="off"
							min="60"
							type="number"
							name="accessTokenExpirationSeconds"
							value={data.accessTokenExpirationSeconds}
							onChange={(e) => handleChange(e, validate)}
						/>
					</div>
				)}
			</FormValidation>
		</div>
	)
}
export default SecurityConfigurationForm
