import React from 'react'
import { AdaptiveInputProps } from './index'

export const TextAreaInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
	return (
		<textarea
			style={{
				whiteSpace: 'pre',
				overflowWrap: 'normal',
				overflowX: 'scroll',
				fontSize: '8pt'
			}}
			className={`form-control ${className || ''}`}
			{...props}
		/>
	)
}
