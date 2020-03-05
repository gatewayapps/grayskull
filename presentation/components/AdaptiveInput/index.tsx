import React from 'react'
import { TextInput } from './TextInput'
import { MaskedInput } from './MaskedInput'
import { PhotoInput } from './PhotoInput'
import { TextAreaInput } from './TextAreaInput'
import { DateInput } from './DateInput'
import { CheckboxInput } from './CheckboxInput'
import { SelectInput } from './SelectInput'
import { PhoneInput } from './PhoneInput'
import { OTPInput } from './OTPInput'

export interface AdaptiveInputProps {
	type: string
	className?: string
	onChange?: ({ target: { name: string, value: any } }) => void
	value?: any
	name: string
	readOnly?: boolean
	placeholder?: string
	options?: any
	allowCustom?: boolean
}

const AdaptiveInput: React.FC<AdaptiveInputProps> = (props) => {
	switch (props.type) {
		case 'masked':
			return <MaskedInput {...props} />
		case 'textarea':
			return <TextAreaInput {...props} />
		case 'date':
			return <DateInput {...props} />
		case 'checkbox':
			return <CheckboxInput {...props} />
		case 'select':
			if (props.readOnly) {
				return <TextInput {...props} readOnly={true} />
			} else {
				return <SelectInput {...props} />
			}
		case 'otp':
			return <OTPInput {...props} />
		case 'phone':
			return <PhoneInput {...props} />
		case 'photo':
			return <PhotoInput {...props} />
		case 'text':
		case 'email':
		case 'number':
		default:
			return <TextInput {...props} />
	}
}

export default AdaptiveInput
