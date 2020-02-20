import React from 'react'
import { AdaptiveInputProps } from './index'
import * as libphonenumber from 'google-libphonenumber'
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()

export const PhoneInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
	let parsedValue = props.value
	let formattedValue = props.value
	try {
		parsedValue = phoneUtil.parse(props.value, 'US')
		formattedValue = phoneUtil.format(parsedValue, libphonenumber.PhoneNumberFormat.INTERNATIONAL)
	} catch {}
	return (
		<input
			className={`form-control ${className || ''}`}
			{...props}
			onChange={(e) => {
				let parsedNumber = e.target.value
				try {
					const parsed = phoneUtil.parse(parsedNumber, 'US')
					parsedNumber = parsed.rawInput()
				} catch {}

				props.onChange({
					target: {
						name: props.name,
						value: parsedNumber
					}
				})
			}}
			value={formattedValue || undefined}
		/>
	)
}
