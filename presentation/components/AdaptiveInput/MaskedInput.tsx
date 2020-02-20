import React from 'react'
import { AdaptiveInputProps } from './index'
import Cleave from 'cleave.js/react'

export const MaskedInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
  const { type, ...finalProps } = props
  return (
    <Cleave
      {...finalProps}
      className={`form-control ${className || ''}`}
      value={finalProps.value || ''}
      onChange={(e) => {
        finalProps.onChange({ target: { name: finalProps.name, value: e.target.rawValue } })
      }}
    />
  )
}
