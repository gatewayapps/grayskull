import React from 'react'
import { AdaptiveInputProps } from './index'

export const CheckboxInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
	return (
		<div className="form-check checkbox-slider-md checkbox-slider--b nofocus">
			<label className="m-0">
				<input {...props} className={`${className || 'nofocus'}`} style={{ fontSize: '1.15rem', paddingBottom: 0 }} />
				<span className="nofocus" />
			</label>
		</div>
	)
}
