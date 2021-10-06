import React from 'react'
import styled from 'styled-components'
import { hasLowercase, hasMinLength, hasNumber, hasSymbol, hasUppercase } from '../utils/passwordComplexity'

const PasswordComplexityList = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
	font-size: 0.85rem;
`

interface CheckListItemProps {
	checked: boolean
	label: string
}

const CheckListItem = (props: CheckListItemProps) => {
	const classes = `far fa-fw ${props.checked ? 'fa-check text-success' : 'fa-times text-danger'}`

	return (
		<li>
			<i className={classes} /> {props.label}
		</li>
	)
}

export interface PasswordComplexityProps {
	configuration: {
		passwordMinimumLength: number
		passwordRequiresNumber: boolean
		passwordRequiresSymbol: boolean
		passwordRequiresLowercase: boolean
		passwordRequiresUppercase: boolean
	}
	password: string
}

const PasswordComplexity = (props: PasswordComplexityProps) => {
	const { configuration, password } = props

	return (
		<PasswordComplexityList>
			<CheckListItem
				checked={hasMinLength(password, configuration.passwordMinimumLength)}
				label={`Minimum length of ${configuration.passwordMinimumLength} characters`}
			/>
			{configuration.passwordRequiresLowercase && (
				<CheckListItem checked={hasLowercase(password)} label="Contains lowercase letters (a-z)" />
			)}
			{configuration.passwordRequiresUppercase && (
				<CheckListItem checked={hasUppercase(password)} label="Contains uppercase letters (A-Z)" />
			)}
			{configuration.passwordRequiresNumber && (
				<CheckListItem checked={hasNumber(password)} label="Contains a number (0-9)" />
			)}
			{configuration.passwordRequiresSymbol && (
				<CheckListItem checked={hasSymbol(password)} label="Contains a symbol (!, #, @, etc...)" />
			)}
		</PasswordComplexityList>
	)
}

export default PasswordComplexity
