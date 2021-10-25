import React from 'react'
import { FormValidation, FormValidationRule } from '@gatewayapps/react-form-validation'
import ResponsiveValidatingInput from '../ResponsiveValidatingInput'
import { IMailConfiguration } from '../../../foundation/models/IMailConfiguration'

export interface IMailConfigurationFormProps {
	data: IMailConfiguration
	onValidated: (isValid: boolean, errors: any) => void
	onConfigurationChanged: (configuration: IMailConfiguration) => void
}

const MailConfigurationForm = ({ data, onValidated, onConfigurationChanged }: IMailConfigurationFormProps) => {
	const validations = [
		new FormValidationRule('serverAddress', 'isEmpty', false, 'Server Address is required'),
		new FormValidationRule('serverAddress', 'isURL', true, 'Server Address must be a valid URL'),
		new FormValidationRule('port', 'isEmpty', false, 'SMTP Port is required'),
		new FormValidationRule('fromAddress', 'isEmpty', false, 'From Address is required'),
		new FormValidationRule('fromAddress', 'isEmail', true, 'From Address must be a valid email address')
	]

	const handleChange = (e, validate) => {
		if (e.target.type === 'checkbox') {
			data[e.target.name] = e.target.checked
		} else {
			data[e.target.name] = e.target.value
		}

		onConfigurationChanged(data)
		if (validate) {
			validate()
		}
	}

	return (
		<div>
			<FormValidation validations={validations} data={data} onValidated={onValidated}>
				{({ validate, validationErrors }) => (
					<div>
						<h5>Mail Configuration</h5>
						<ResponsiveValidatingInput
							label="Server Address"
							validationErrors={validationErrors}
							autoFocus
							autoComplete="off"
							type="url"
							name="serverAddress"
							value={data.serverAddress}
							onChange={(e) => handleChange(e, validate)}
						/>

						<ResponsiveValidatingInput
							label="Server Port"
							validationErrors={validationErrors}
							autoComplete="off"
							type="number"
							name="port"
							value={data.port}
							onChange={(e) => handleChange(e, validate)}
						/>

						<ResponsiveValidatingInput
							label="TLS/SSL Enabled"
							validationErrors={validationErrors}
							type="checkbox"
							name="tlsSslRequired"
							placeholder="Optional"
							value={data.tlsSslRequired}
							onChange={(e) => handleChange(e, validate)}
						/>

						<ResponsiveValidatingInput
							label="Username"
							validationErrors={validationErrors}
							autoComplete="new-password"
							type="text"
							name="username"
							placeholder="Optional"
							value={data.username}
							onChange={(e) => handleChange(e, validate)}
						/>

						<ResponsiveValidatingInput
							label="Password"
							validationErrors={validationErrors}
							autoComplete="new-password"
							type="password"
							name="password"
							placeholder="Optional"
							value={data.password}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							label="Sendgrid API Key"
							validationErrors={validationErrors}
							autoComplete="new-password"
							type="password"
							name="sendgridApiKey"
							placeholder="Optional"
							value={data.sendgridApiKey}
							onChange={(e) => handleChange(e, validate)}
						/>
						<ResponsiveValidatingInput
							label="From Address"
							validationErrors={validationErrors}
							autoComplete="off"
							type="email"
							name="fromAddress"
							value={data.fromAddress}
							onChange={(e) => handleChange(e, validate)}
						/>
					</div>
				)}
			</FormValidation>
		</div>
	)
}
export default MailConfigurationForm
