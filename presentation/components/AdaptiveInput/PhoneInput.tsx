import React from 'react'
import { AdaptiveInputProps } from './index'
import * as libphonenumber from 'google-libphonenumber'
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()

export const PhoneInput: React.FC<AdaptiveInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`form-control ${className || ''}`}
      {...props}
      onChange={(e) => {
        let parsedNumber = e.target.value
        try {
          const parsed = phoneUtil.parse(parsedNumber, 'US')
          parsedNumber = phoneUtil.format(parsed, libphonenumber.PhoneNumberFormat.INTERNATIONAL)
        } catch {}

        props.onChange({
          target: {
            name: props.name,
            value: parsedNumber
          }
        })
      }}
      value={props.value || undefined}
    />
  )
}
