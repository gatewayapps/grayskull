import React from 'react'

export interface ILoadingIndicatorProps {
  message?: String
}

const LoadingIndicator = ({ message = 'Loading' }: ILoadingIndicatorProps) => (
  <div>
    {message} <i className="fal fa-circle-notch fa-spin" />
  </div>
)

export default LoadingIndicator
