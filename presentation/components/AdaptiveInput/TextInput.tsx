import React from 'react'
import { AdaptiveInputProps } from './index'

export const TextInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
	return <input className={`form-control ${className || ''}`} {...props} value={props.value || undefined} />
}
