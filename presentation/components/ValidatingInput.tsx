import { FormValidationMessage } from '@gatewayapps/react-form-validation'
import React from 'react'
import AdaptiveInput from './AdaptiveInput'

export interface IValidatingInputProps {
	name: string
	validationErrors?: Record<string, string[]>
	autoComplete?: string
	autoFocus?: boolean
	allowCustom?: boolean
	options?: any
	disabled?: boolean
	min?: number | string
	max?: number | string
	checked?: boolean
	getOptionValue?: any
	style?: React.CSSProperties
	getOptionLabel?: any
	readOnly?: boolean
	className?: string
	type: any
	value?: any
	id?: any
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ValidatingInput: React.FC<IValidatingInputProps> = ({ name, validationErrors, className, ...props }: any) => {
	const readOnlyClass = props.readOnly ? 'border-bottom-0' : ''
	const validationClass = validationErrors[name] ? 'is-invalid' : props.readOnly ? '' : 'is-valid'

	const finalProps = Object.assign(props, {
		id: props.id || name,
		name: name,
		className: `${className} ${readOnlyClass} ${validationClass}`
	})
	const inputComponent = <AdaptiveInput {...finalProps} />

	return (
		<div>
			<div className="d-flex h-100 align-items-center ">{inputComponent}</div>
			<FormValidationMessage id={`${name}HelpBlock`} validationErrors={validationErrors[name]} />
		</div>
	)
}

export default ValidatingInput
