import gql from 'graphql-tag'
import React from 'react'
import { useApolloClient } from 'react-apollo'
import { validatePassword } from '../utils/passwordComplexity'
import PasswordComplexity from './PasswordComplexity'
import { FormValidation, FormValidationRule, OnValidatedFn, ValidateFn } from '@gatewayapps/react-form-validation'
import ResponsiveValidatingInput from './ResponsiveValidatingInput'
import { ISecurityConfiguration } from '../../foundation/types/types'
import ApolloClient from 'apollo-client'

const EMAIL_ADDRESS_AVAILABLE = gql`
	query EMAIL_ADDRESS_AVAILABLE($emailAddress: String!) {
		emailAddressAvailable(emailAddress: $emailAddress)
	}
`

export interface RegistrationFormData {
	emailAddress: string
	firstName: string
	lastName: string
	password: string
	confirm: string
}

export interface RegistrationFormProps {
	configuration: ISecurityConfiguration
	data: RegistrationFormData
	disableEmailAvailabilityCheck?: boolean
	onChange: (name: string, value: string) => void
	onValidated?: OnValidatedFn
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
	configuration,
	data,
	disableEmailAvailabilityCheck = false,
	onChange,
	onValidated
}) => {
	const apolloClient = useApolloClient()

	const checkEmailAvailable = React.useCallback(
		async (emailAddress: string, client: ApolloClient<unknown>) => {
			if (!emailAddress || disableEmailAvailabilityCheck) {
				return true
			}

			const { data } = await client.query({
				query: EMAIL_ADDRESS_AVAILABLE,
				variables: { emailAddress },
				fetchPolicy: 'network-only'
			})

			return data.emailAddressAvailable
		},
		[disableEmailAvailabilityCheck]
	)

	const validations = React.useMemo(() => {
		return [
			new FormValidationRule('emailAddress', 'isEmpty', false, 'E-mail address is required'),
			new FormValidationRule('emailAddress', 'isEmail', true, 'Not a valid email address'),
			new FormValidationRule(
				'emailAddress',
				checkEmailAvailable,
				true,
				'Sorry, this email address is already being used by another account',
				[apolloClient]
			),
			new FormValidationRule('firstName', 'isEmpty', false, 'First name is required'),
			new FormValidationRule('lastName', 'isEmpty', false, 'Last name is required'),
			new FormValidationRule('password', 'isEmpty', false, 'Password is required'),
			new FormValidationRule('password', validatePassword, true, 'Password does not meet complexity requirements', [
				configuration
			]),
			new FormValidationRule('confirm', 'isEmpty', false, 'Confirm password is required'),
			new FormValidationRule('confirm', 'equals', true, 'Confirm should match the password', [data.password])
		]
	}, [checkEmailAvailable, apolloClient, configuration, data.password])

	const handleChange = React.useCallback(
		(evt: React.ChangeEvent<HTMLInputElement>, validate?: ValidateFn) => {
			onChange(evt.target.name, evt.target.value)
			if (validate) {
				validate()
			}
		},
		[onChange]
	)

	return (
		<FormValidation validations={validations} data={data} onValidated={onValidated}>
			{({ validate, validationErrors }) => (
				<div>
					<h5>User Profile</h5>

					<ResponsiveValidatingInput
						autoComplete="username"
						label="E-mail address"
						autoFocus
						validationErrors={validationErrors}
						type="email"
						name="emailAddress"
						value={data.emailAddress}
						onChange={(e) => handleChange(e, validate)}
					/>

					<ResponsiveValidatingInput
						label="First Name"
						validationErrors={validationErrors}
						type="text"
						autoComplete="nope"
						name="firstName"
						value={data.firstName}
						onChange={(e) => handleChange(e, validate)}
					/>

					<ResponsiveValidatingInput
						validationErrors={validationErrors}
						label="Last Name"
						type="text"
						autoComplete="nope"
						name="lastName"
						value={data.lastName}
						onChange={(e) => handleChange(e, validate)}
					/>

					<ResponsiveValidatingInput
						validationErrors={validationErrors}
						label="Password"
						autoComplete="new-password"
						type="password"
						name="password"
						value={data.password}
						onChange={(e) => handleChange(e, validate)}
					/>

					<div
						className="alert alert-secondary border-secondary col-12 col-md-9 offset-md-3"
						style={{ border: '1px solid' }}>
						<div className="alert-heading">Password requirements</div>
						<div>
							<PasswordComplexity configuration={configuration} password={data.password} />
						</div>
					</div>

					<ResponsiveValidatingInput
						type="password"
						label="Confirm Password"
						validationErrors={validationErrors}
						autoComplete="new-password"
						name="confirm"
						value={data.confirm}
						onChange={(e) => handleChange(e, validate)}
					/>
				</div>
			)}
		</FormValidation>
	)
}

export default RegistrationForm
