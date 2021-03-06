import React from 'react'
import { AdaptiveInputProps } from './index'
import ImageDropArea from '../ImageDropArea'

export const PhotoInput: React.FC<AdaptiveInputProps> = (props) => {
	if (props.readOnly) {
		return <img className="d-block" style={{ height: '150px' }} src={props.value} />
	} else {
		const finalProps = { ...props, style: '', className: '' }

		return (
			<ImageDropArea
				{...finalProps}
				value={finalProps.value || ''}
				style={{ height: '150px', maxWidth: '400px', padding: '2px', border: '1px black dashed' }}
				src={props.value}
				onUploadComplete={(file) => {
					if (props.onChange) {
						props.onChange({ target: { name: props.name, value: file.url } })
					}
				}}
			/>
		)
	}
}
