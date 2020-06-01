import React from 'react'

export interface ILoadingIndicatorProps {
	message?: string
}

const LoadingIndicator = ({ message = 'Loading' }: ILoadingIndicatorProps) => (
	<div className="m-2">
		<i className="fal fa-circle-notch fa-spin fa-fw mr-2" />
		{message}
	</div>
)

export default LoadingIndicator
