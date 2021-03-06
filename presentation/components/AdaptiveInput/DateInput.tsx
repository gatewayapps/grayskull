import React from 'react'
import { AdaptiveInputProps } from './index'
import Cleave from 'cleave.js/react'

export const DateInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
	return (
		<Cleave
			{...props}
			onChange={(e) => {
				if (props.onChange) {
					props.onChange({ target: { name: props.name, value: e.target.value } })
				}
			}}
			options={{ blocks: [2, 2, 4], delimiter: '/' }}
			placeholder={'MM/DD/YYYY'}
			type={undefined}
			value={props.value || ''}
			className={`form-control ${className || ''}`}
		/>
	)
}
