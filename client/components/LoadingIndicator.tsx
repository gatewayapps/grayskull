import React from 'react'

export interface ILoadingIndicatorProps {
  message?: String
}

const LoadingIndicator = ({ message = 'Loading' }: ILoadingIndicatorProps) => (
  <div>
    <i className="fal fa-circle-notch fa-spin fa-fw" />
    {message}
  </div>
)

export default LoadingIndicator
