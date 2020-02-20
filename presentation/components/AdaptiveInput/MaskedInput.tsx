import React from 'react'
import { AdaptiveInputProps } from './index'
import Cleave from 'cleave.js/react'

export const MaskedInput: React.FC<AdaptiveInputProps> = (props) => {
  return (
    <Cleave
      {...props}
      type={undefined}
      className={`form-control ${props.className || ''}`}
      value={props.value || ''}
      onChange={(e) => {
        props.onChange({ target: { name: props.name, value: e.target.rawValue } })
      }}
    />
  )
}
