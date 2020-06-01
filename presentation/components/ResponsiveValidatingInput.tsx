import React from 'react'
import ValidatingInput, { IValidatingInputProps } from './ValidatingInput'

export interface ResponsiveValidatingInputProps extends IValidatingInputProps {
	placeholder?: string
	label: string
	labelColumnWidth?: number
	labelStyles?: React.CSSProperties
	helpText?: string
}

const ResponsiveValidatingInput: React.FC<ResponsiveValidatingInputProps> = ({
	label,
	labelColumnWidth = 3,
	helpText,
	validationErrors = [],
	...props
}) => {
	const labelMediumColumnClass = `col-md-${labelColumnWidth}`
	const inputMediumColumnClass = `col-md-${12 - labelColumnWidth}`

	const finalClassName = `${props.readOnly ? 'form-control-plaintext border-bottom-0' : ''} ${props.className || ''}`

	return (
		<div className="form-group row align-items-start my-1">
			<label
				className={`d-none d-md-block col-sm-12 ${labelMediumColumnClass} col-form-label noselect`}
				style={{ fontSize: '0.725rem', textTransform: 'uppercase', opacity: 0.75, paddingTop: '1.25rem' }}
				htmlFor={props.name}>
				{label}
			</label>
			<div className={`col-sm-12 ${inputMediumColumnClass} align-self-center`}>
				<ValidatingInput
					className={finalClassName}
					placeholder={props.placeholder || label}
					validationErrors={validationErrors}
					{...props}
				/>
			</div>
			{helpText && <small className="form-text text-muted col-12 py-0 my-0">{helpText}</small>}
		</div>
	)
}

export default ResponsiveValidatingInput
